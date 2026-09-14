import assert from "node:assert/strict";
import test from "node:test";

import { createLeadHandler, type LeadRequest, type LeadResponse } from "./leads.ts";

const validBody = {
  name: "Kofi Mensah",
  email: "kofi.mensah@example.com",
  contactHandle: "@kofitrades",
  experience: "advanced",
  market: "indices",
  interest: "mentorship",
  problem: "Need guidance managing risk across multiple prop accounts simultaneously.",
  nextStep: "book-call",
  chosenPlan: "Mentorship",
  website: "",
  pageUrl: "https://sirhansfelix-praxis.vercel.app/#apply",
  referrer: "https://t.me/sirhansfelix",
};

function createMockRequest(body: unknown, overrides: Partial<LeadRequest> = {}): LeadRequest {
  return {
    method: "POST",
    headers: {
      origin: "https://sirhansfelix-praxis.vercel.app",
      "user-agent": "Mozilla/5.0 Test",
      "x-forwarded-for": "198.51.100.22",
    },
    body,
    ...overrides,
  };
}

function createMockResponse() {
  let bodyPayload = "";
  const headers = new Map<string, string>();

  const res: LeadResponse & { getResult: () => { statusCode: number; headers: Map<string, string>; body: any } } = {
    statusCode: 200,
    setHeader(name: string, value: string) {
      headers.set(name.toLowerCase(), value);
    },
    end(value = "") {
      bodyPayload = value;
    },
    getResult() {
      return {
        statusCode: this.statusCode,
        headers,
        body: bodyPayload ? JSON.parse(bodyPayload) : null,
      };
    },
  };

  return res;
}

test("API: rejects non-POST requests with 405", async () => {
  const handler = createLeadHandler();
  const req = createMockRequest(validBody, { method: "GET" });
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.getResult().statusCode, 405);
  assert.equal(res.getResult().body.ok, false);
});

test("API: returns 400 with fieldErrors on invalid submission", async () => {
  let webhookCalled = false;
  const handler = createLeadHandler({
    getWebhookUrl: () => "https://n8n.example.com/webhook/hans-leads",
    fetchImpl: async () => {
      webhookCalled = true;
      return new Response(null, { status: 200 });
    },
  });

  const req = createMockRequest({ ...validBody, email: "invalid-email" });
  const res = createMockResponse();

  await handler(req, res);

  const result = res.getResult();
  assert.equal(result.statusCode, 400);
  assert.equal(result.body.ok, false);
  assert.ok(result.body.fieldErrors?.email);
  assert.equal(webhookCalled, false);
});

test("API: silently accepts honeypot submissions without calling webhook", async () => {
  let webhookCalled = false;
  const handler = createLeadHandler({
    getWebhookUrl: () => "https://n8n.example.com/webhook/hans-leads",
    fetchImpl: async () => {
      webhookCalled = true;
      return new Response(null, { status: 200 });
    },
  });

  const req = createMockRequest({ ...validBody, website: "bot-url.com" });
  const res = createMockResponse();

  await handler(req, res);

  const result = res.getResult();
  assert.equal(result.statusCode, 201);
  assert.equal(result.body.ok, true);
  assert.equal(result.body.leadId, "accepted");
  assert.equal(webhookCalled, false);
});

test("API: returns 503 setup mode when webhook URL is missing", async () => {
  const handler = createLeadHandler({
    getWebhookUrl: () => undefined,
  });

  const req = createMockRequest(validBody);
  const res = createMockResponse();

  await handler(req, res);

  const result = res.getResult();
  assert.equal(result.statusCode, 503);
  assert.equal(result.body.ok, false);
  assert.equal(result.body.setupRequired, true);
});

test("API: forwards valid lead with hans- prefix and hans-praxis source to webhook", async () => {
  let capturedPayload: any = null;
  let capturedUrl = "";

  const handler = createLeadHandler({
    getWebhookUrl: () => "https://hans-n8n.example.com/webhook/hans-leads",
    fetchImpl: async (url, init) => {
      capturedUrl = url.toString();
      capturedPayload = JSON.parse(init?.body as string);
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    },
  });

  const req = createMockRequest(validBody);
  const res = createMockResponse();

  await handler(req, res);

  const result = res.getResult();
  assert.equal(result.statusCode, 201);
  assert.equal(result.body.ok, true);
  assert.ok(result.body.leadId.startsWith("hans-"));

  // Verify forwarded payload
  assert.equal(capturedUrl, "https://hans-n8n.example.com/webhook/hans-leads");
  assert.equal(capturedPayload.source, "SirHansFelix Website");
  assert.ok(capturedPayload.leadId.startsWith("hans-"));
  assert.equal(capturedPayload.name, "Kofi Mensah");
  assert.equal(capturedPayload.email, "kofi.mensah@example.com");
  assert.equal(capturedPayload.contactHandle, "@kofitrades");
  assert.equal(capturedPayload.experience, "advanced");
  assert.equal(capturedPayload.market, "indices");
  assert.equal(capturedPayload.interest, "mentorship");
  assert.equal(capturedPayload.problem, "Need guidance managing risk across multiple prop accounts simultaneously.");
  assert.equal(capturedPayload.nextStep, "book-call");
  assert.equal(capturedPayload.chosenPlan, "Mentorship");
  assert.ok(capturedPayload.leadScore >= 7);
});

test("API: returns 502 when webhook endpoint fails or returns error status", async () => {
  const handler = createLeadHandler({
    getWebhookUrl: () => "https://hans-n8n.example.com/webhook/hans-leads",
    fetchImpl: async () => new Response("Internal server error", { status: 500 }),
    reportError: () => {},
  });

  const req = createMockRequest(validBody);
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.getResult().statusCode, 502);
  assert.equal(res.getResult().body.ok, false);
});
