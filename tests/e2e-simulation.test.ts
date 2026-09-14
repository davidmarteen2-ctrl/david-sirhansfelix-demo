import assert from "node:assert/strict";
import http from "node:http";
import test from "node:test";
import { createLeadHandler } from "../api/leads.ts";
import { scoreLead } from "../src/features/lead-capture/lead.ts";

interface WebhookReceivedEvent {
  body: any;
  headers: http.IncomingHttpHeaders;
}

interface MockSheetRow {
  leadId: string;
  name: string;
  email: string;
  contactHandle: string;
  experience: string;
  market: string;
  interest: string;
  problem: string;
  nextStep: string;
  chosenPlan: string;
  leadScore: number;
  qualificationStatus: string;
  source: string;
}

interface MockTelegramMessage {
  chatId: string;
  text: string;
}

test("PHASE 8: End-to-End Test Suite (TEST A, B, C, D)", async () => {
  // 1. Setup Mock n8n Webhook + Sheets + Telegram Simulator
  const receivedWebhooks: WebhookReceivedEvent[] = [];
  const sheetRows: MockSheetRow[] = [];
  const telegramMessages: MockTelegramMessage[] = [];

  const mockN8nServer = http.createServer((req, res) => {
    if (req.url === "/webhook/hans-leads" && req.method === "POST") {
      let raw = "";
      req.on("data", (chunk) => {
        raw += chunk;
      });
      req.on("end", () => {
        const payload = JSON.parse(raw);
        receivedWebhooks.push({ body: payload, headers: req.headers });

        // Simulate "Initialize Revenue State" + "Save Lead" to Google Sheets
        const isQualified = payload.leadScore >= 7;
        const row: MockSheetRow = {
          leadId: payload.leadId,
          name: payload.name,
          email: payload.email,
          contactHandle: payload.contactHandle,
          experience: payload.experience,
          market: payload.market,
          interest: payload.interest,
          problem: payload.problem,
          nextStep: payload.nextStep,
          chosenPlan: payload.chosenPlan,
          leadScore: payload.leadScore,
          qualificationStatus: isQualified ? "Qualified" : "Nurture",
          source: payload.source,
        };
        sheetRows.push(row);

        // Simulate Telegram Alert
        const alertHeader = isQualified
          ? "🔥 NEW SIRHANSFELIX LEAD"
          : "🟡 SIRHANSFELIX NURTURE LEAD";
        telegramMessages.push({
          chatId: "399527823",
          text: `${alertHeader}\nName: ${payload.name}\nScore: ${payload.leadScore}/12\nContact: ${payload.contactHandle}\nEmail: ${payload.email}`,
        });

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, message: "Workflow executed" }));
      });
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  await new Promise<void>((resolve) => mockN8nServer.listen(0, resolve));
  const port = (mockN8nServer.address() as any).port;
  const webhookUrl = `http://127.0.0.1:${port}/webhook/hans-leads`;

  // Instantiate the actual Hans API handler pointing to this webhook
  const handler = createLeadHandler({
    getWebhookUrl: () => webhookUrl,
  });

  async function submitApi(body: any) {
    let statusCode = 200;
    let responseBody: any = null;

    const mockReq = {
      method: "POST",
      headers: {
        origin: "https://sirhansfelix.com",
        "user-agent": "E2E-Tester/1.0",
        "x-forwarded-for": "127.0.0.1",
      },
      body,
    };

    const mockRes = {
      statusCode: 200,
      setHeader: () => {},
      end: (val = "") => {
        responseBody = val ? JSON.parse(val) : null;
      },
    };

    await handler(mockReq as any, mockRes as any);
    return { statusCode: mockRes.statusCode, body: responseBody };
  }

  try {
    // ─────────────────────────────────────────────────────────────
    // TEST A: Submit a valid Hans lead from the website API
    // ─────────────────────────────────────────────────────────────
    const leadA = {
      name: "David Adeleke",
      email: "david.adeleke@example.com",
      contactHandle: "+2348012345678",
      experience: "advanced",
      market: "gold",
      interest: "mentorship",
      problem: "Need structured risk management on high-lot XAUUSD scalp entries.",
      nextStep: "book-call",
      chosenPlan: "Mentorship",
      website: "",
      pageUrl: "https://sirhansfelix.com/#apply",
      referrer: "https://t.me/sirhansfelix",
    };

    const resA = await submitApi(leadA);

    assert.equal(resA.statusCode, 201, "Test A: API should return 201 Created");
    assert.equal(resA.body.ok, true, "Test A: API body should indicate success");
    assert.ok(
      resA.body.leadId.startsWith("hans-"),
      `Test A: leadId must have hans- prefix, got ${resA.body.leadId}`
    );

    // Verify webhook received lead
    assert.equal(receivedWebhooks.length, 1, "Test A: Webhook must receive 1 event");
    const webhookA = receivedWebhooks[0].body;
    assert.equal(webhookA.source, "SirHansFelix Website", "Test A: source must be SirHansFelix Website");
    assert.equal(webhookA.name, "David Adeleke");
    assert.equal(webhookA.email, "david.adeleke@example.com");

    // Verify Google Sheet received row
    assert.equal(sheetRows.length, 1, "Test A: Sheet must receive 1 row");
    const sheetA = sheetRows[0];
    assert.equal(sheetA.name, "David Adeleke");
    assert.equal(sheetA.market, "gold");
    assert.equal(sheetA.qualificationStatus, "Qualified");

    // Verify Telegram notification arrives
    assert.equal(telegramMessages.length, 1, "Test A: Telegram alert must arrive");
    assert.ok(
      telegramMessages[0].text.includes("🔥 NEW SIRHANSFELIX LEAD"),
      "Test A: Telegram notification must have Qualified header"
    );
    assert.ok(
      telegramMessages[0].text.includes("David Adeleke"),
      "Test A: Telegram notification must include lead name"
    );

    // ─────────────────────────────────────────────────────────────
    // TEST B: Submit another lead with different information
    // ─────────────────────────────────────────────────────────────
    const leadB = {
      name: "Chioma Okonjo",
      email: "chioma.okonjo@example.com",
      contactHandle: "@chiomatrades",
      experience: "intermediate",
      market: "forex",
      interest: "signals",
      problem: "I need verified signals for London and New York session EURUSD setups.",
      nextStep: "see-pricing",
      chosenPlan: "Signals",
      website: "",
      pageUrl: "https://sirhansfelix.com/#apply",
      referrer: "https://instagram.com/sirhansfelix",
    };

    const resB = await submitApi(leadB);

    assert.equal(resB.statusCode, 201, "Test B: API should return 201 Created");
    assert.equal(receivedWebhooks.length, 2, "Test B: Webhook must receive second event");
    assert.equal(sheetRows.length, 2, "Test B: Sheet must receive second row");

    const sheetB = sheetRows[1];
    assert.equal(sheetB.name, "Chioma Okonjo");
    assert.equal(sheetB.contactHandle, "@chiomatrades");
    assert.equal(sheetB.market, "forex");
    assert.equal(sheetB.interest, "signals");
    assert.equal(sheetB.chosenPlan, "Signals");

    // ─────────────────────────────────────────────────────────────
    // TEST C: Submit an invalid form
    // ─────────────────────────────────────────────────────────────
    const invalidLead = {
      name: "", // Empty name
      email: "not-an-email", // Malformed email
      contactHandle: "", // Missing handle
      experience: "invalid-experience",
      market: "invalid-market",
      interest: "invalid-interest",
      problem: "short", // < 12 chars
      nextStep: "invalid-step",
    };

    const resC = await submitApi(invalidLead);

    assert.equal(resC.statusCode, 400, "Test C: Invalid input must return 400");
    assert.equal(resC.body.ok, false);
    assert.ok(resC.body.fieldErrors?.name, "Test C: name error must be flagged");
    assert.ok(resC.body.fieldErrors?.email, "Test C: email error must be flagged");
    assert.ok(resC.body.fieldErrors?.contactHandle, "Test C: contactHandle error must be flagged");
    assert.ok(resC.body.fieldErrors?.problem, "Test C: problem error must be flagged");

    // Verify webhook and sheet did not receive invalid lead
    assert.equal(receivedWebhooks.length, 2, "Test C: Webhook count must not increase");
    assert.equal(sheetRows.length, 2, "Test C: Sheet row count must not increase");

    // ─────────────────────────────────────────────────────────────
    // TEST D: Qualification scoring branch behavior
    // ─────────────────────────────────────────────────────────────
    // High-intent qualified lead (Advanced + gold + mentorship + book-call)
    const qualifiedScore = scoreLead({
      name: "Sarah Connor",
      email: "sarah@example.com",
      contactHandle: "@sarahc",
      experience: "advanced",
      market: "gold",
      interest: "mentorship",
      problem: "Looking for 1-on-1 coaching on prop firm challenges and drawdown control.",
      nextStep: "book-call",
      chosenPlan: "Mentorship",
      website: "",
    });
    assert.ok(
      qualifiedScore >= 7,
      `Test D: Advanced high-intent lead score should be >= 7, got ${qualifiedScore}`
    );

    // Low-intent nurture lead (Beginner + crypto + free-content + ask-question)
    const nurtureScore = scoreLead({
      name: "Toby Flenderson",
      email: "toby@example.com",
      contactHandle: "@tobyt",
      experience: "beginner",
      market: "crypto",
      interest: "free-content",
      problem: "Just learning basics and looking for free materials to start out.",
      nextStep: "ask-question",
      chosenPlan: "",
      website: "",
    });
    assert.ok(
      nurtureScore < 7,
      `Test D: Beginner low-intent lead score should be < 7, got ${nurtureScore}`
    );
  } finally {
    await new Promise<void>((resolve) => mockN8nServer.close(() => resolve()));
  }
});
