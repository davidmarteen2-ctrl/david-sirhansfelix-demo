import assert from "node:assert/strict";
import test from "node:test";

import {
  buildLeadRecord,
  scoreLead,
  validateLead,
  type LeadInput,
} from "./lead.ts";

const validLead: LeadInput = {
  name: "Marcus Vance",
  email: "marcus.vance@example.com",
  contactHandle: "+447700900123",
  experience: "intermediate",
  market: "forex",
  interest: "signals",
  problem: "I struggle with consistency when managing trade drawdowns during high volatility.",
  nextStep: "see-pricing",
  chosenPlan: "Signals",
  website: "",
};

test("validateLead accepts valid complete submission", () => {
  const result = validateLead(validLead);
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.data.name, "Marcus Vance");
    assert.equal(result.data.email, "marcus.vance@example.com");
    assert.equal(result.data.experience, "intermediate");
  }
});

test("validateLead flags invalid inputs with descriptive field errors", () => {
  const result = validateLead({
    ...validLead,
    name: "A",
    email: "notanemail",
    problem: "Too short",
    experience: "guru",
  });
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.ok(result.fieldErrors.name);
    assert.ok(result.fieldErrors.email);
    assert.ok(result.fieldErrors.problem);
    assert.ok(result.fieldErrors.experience);
  }
});

test("scoreLead computes appropriate tiers (beginner vs advanced)", () => {
  const beginnerLead: LeadInput = {
    ...validLead,
    experience: "beginner",
    market: "crypto",
    interest: "free-content",
    nextStep: "ask-question",
    chosenPlan: "",
  };
  const beginnerScore = scoreLead(beginnerLead);
  assert.ok(beginnerScore < 7, `Expected score < 7 (Nurture), got ${beginnerScore}`);

  const advancedLead: LeadInput = {
    ...validLead,
    experience: "advanced",
    market: "gold",
    interest: "mentorship",
    nextStep: "book-call",
    chosenPlan: "Mentorship",
  };
  const advancedScore = scoreLead(advancedLead);
  assert.ok(advancedScore >= 7, `Expected score >= 7 (Qualified), got ${advancedScore}`);
});

test("buildLeadRecord generates hans- prefixed ID and hans-praxis source", () => {
  const record = buildLeadRecord(validLead, {
    submittedAt: "2026-09-13T16:30:00.000Z",
    source: "hans-praxis",
    pageUrl: "https://sirhansfelix.com/#apply",
    referrer: "https://instagram.com/sirhansfelix",
    userAgent: "Mozilla/5.0 Test",
  });

  assert.ok(record.leadId.startsWith("hans-"), `Expected leadId to start with hans-, got ${record.leadId}`);
  assert.equal(record.source, "hans-praxis");
  assert.equal(record.name, "Marcus Vance");
  assert.equal(record.contactHandle, "+447700900123");
  assert.equal(typeof record.leadScore, "number");
});
