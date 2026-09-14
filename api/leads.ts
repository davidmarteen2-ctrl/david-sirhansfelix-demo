import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import {
  buildLeadRecord,
  validateLead,
} from "../src/features/lead-capture/lead.js";

type HeaderValue = string | string[] | undefined;

export interface LeadRequest {
  method?: string;
  headers: Record<string, HeaderValue>;
  body?: unknown;
}

export interface LeadResponse {
  statusCode: number;
  setHeader(name: string, value: string): void;
  end(value?: string): void;
}

interface LeadHandlerDependencies {
  getWebhookUrl?: () => string | undefined;
  getAllowedOrigins?: () => string[];
  fetchImpl?: typeof fetch;
  now?: () => Date;
  rateLimit?: (ip: string) => Promise<boolean>;
  reportError?: (message: string) => void;
}

const defaultRateLimit = (() => {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return undefined;

  const limiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(5, "60 s"),
    prefix: "hans-leads",
  });

  return async (ip: string) => (await limiter.limit(ip)).success;
})();

function firstHeader(value: HeaderValue): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function safeText(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function sendJson(
  res: LeadResponse,
  statusCode: number,
  body: Record<string, unknown>,
) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

export function createLeadHandler(dependencies: LeadHandlerDependencies = {}) {
  const getWebhookUrl = dependencies.getWebhookUrl
    ?? (() => process.env.LEAD_WEBHOOK_URL);
  const getAllowedOrigins = dependencies.getAllowedOrigins ?? (() =>
    (process.env.ALLOWED_ORIGINS ?? "")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean));
  const fetchImpl = dependencies.fetchImpl ?? fetch;
  const now = dependencies.now ?? (() => new Date());
  const rateLimit = dependencies.rateLimit ?? defaultRateLimit;
  const reportError = dependencies.reportError ?? console.error;

  return async function leadHandler(req: LeadRequest, res: LeadResponse) {
    if (req.method !== "POST") {
      sendJson(res, 405, { ok: false, error: "Method not allowed." });
      return;
    }

    const origin = firstHeader(req.headers.origin);
    const allowedOrigins = getAllowedOrigins();
    if (allowedOrigins.length > 0 && !allowedOrigins.includes(origin)) {
      sendJson(res, 403, { ok: false, error: "Forbidden." });
      return;
    }

    if (rateLimit) {
      const forwardedFor = firstHeader(req.headers["x-forwarded-for"]);
      const ip = forwardedFor.split(",")[0]?.trim() || "0.0.0.0";
      try {
        if (!(await rateLimit(ip))) {
          sendJson(res, 429, {
            ok: false,
            error: "Too many applications. Please wait a minute and try again.",
          });
          return;
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown failure";
        reportError(`[hans-leads] Rate limiter unavailable: ${message}`);
      }
    }

    const validation = validateLead(req.body);
    if (validation.ok === false) {
      sendJson(res, 400, {
        ok: false,
        error: "Check the highlighted fields.",
        fieldErrors: validation.fieldErrors,
      });
      return;
    }

    if (validation.data.website) {
      sendJson(res, 201, { ok: true, leadId: "accepted" });
      return;
    }

    const webhookUrl = getWebhookUrl()?.trim();
    if (!webhookUrl) {
      sendJson(res, 503, {
        ok: false,
        error: "Lead capture is in setup mode. Connect the automation webhook to receive applications.",
        setupRequired: true,
      });
      return;
    }

    const body = req.body as Record<string, unknown>;
    const lead = buildLeadRecord(validation.data, {
      submittedAt: now().toISOString(),
      source: "SirHansFelix Website",
      pageUrl: safeText(body.pageUrl, 500),
      referrer: safeText(body.referrer, 500),
      userAgent: safeText(firstHeader(req.headers["user-agent"]), 300),
    });

    try {
      const webhookResponse = await fetchImpl(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
        signal: AbortSignal.timeout(8_000),
      });

      if (!webhookResponse.ok) {
        reportError(`[hans-leads] Webhook returned ${webhookResponse.status}`);
        sendJson(res, 502, {
          ok: false,
          error: "We could not send your application. Please try again.",
        });
        return;
      }

      sendJson(res, 201, { ok: true, leadId: lead.leadId });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown failure";
      reportError(`[hans-leads] Webhook request failed: ${message}`);
      sendJson(res, 502, {
        ok: false,
        error: "We could not send your application. Please try again.",
      });
    }
  };
}

export default createLeadHandler();
