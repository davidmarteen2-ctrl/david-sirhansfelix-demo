import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const workflowPath = path.resolve(__dirname, "hans-lead-intake-v1.json");

test("Workflow: file exists and parses as valid JSON", () => {
  assert.ok(fs.existsSync(workflowPath), "hans-lead-intake-v1.json should exist");
  const raw = fs.readFileSync(workflowPath, "utf8");
  const data = JSON.parse(raw);
  assert.equal(data.name, "SirHansFelix Lead Intake v1");
});

test("Workflow: webhook node is configured for hans-leads", () => {
  const data = JSON.parse(fs.readFileSync(workflowPath, "utf8"));
  const webhookNode = data.nodes.find((n: any) => n.name === "Receive Website Lead");
  assert.ok(webhookNode, "Receive Website Lead node exists");
  assert.equal(webhookNode.parameters.path, "hans-leads");
  assert.equal(webhookNode.parameters.httpMethod, "POST");
});

test("Workflow: Google Sheets node uses Applications sheet and has schema", () => {
  const data = JSON.parse(fs.readFileSync(workflowPath, "utf8"));
  const sheetsNode = data.nodes.find((n: any) => n.name === "Save Lead");
  assert.ok(sheetsNode, "Save Lead node exists");
  assert.equal(sheetsNode.parameters.sheetName.value, "Applications");
  assert.ok(
    sheetsNode.parameters.documentId.value === "1-FeERbZmWeEP1dkHw2wL-bOvTrvTctAoVKbTuwqsjis" ||
    sheetsNode.parameters.documentId.value === "PASTE_HANS_SPREADSHEET_ID_HERE",
    "documentId should be set"
  );

  const columns = sheetsNode.parameters.columns;
  const mappedKeys = columns.value ? Object.keys(columns.value) : (columns.schema || []).map((c: any) => c.id);
  assert.ok(mappedKeys.length >= 10, "Should have mapped columns");
});

test("Workflow: Telegram notifications use SirHansFelix branding and no NuRui references", () => {
  const data = JSON.parse(fs.readFileSync(workflowPath, "utf8"));
  const alertQualified = data.nodes.find((n: any) => n.name === "Alert Qualified Lead");
  const alertNurture = data.nodes.find((n: any) => n.name === "Alert Nurture Lead");

  assert.ok(alertQualified, "Alert Qualified Lead node exists");
  assert.ok(alertNurture, "Alert Nurture Lead node exists");

  assert.ok(
    alertQualified.parameters.text.includes("SIRHANSFELIX"),
    "Alert text must include SIRHANSFELIX branding"
  );
  assert.ok(
    !alertQualified.parameters.text.includes("NURUI"),
    "Alert text must not contain NURUI branding"
  );
  assert.ok(
    !alertNurture.parameters.text.includes("NURUI"),
    "Nurture alert text must not contain NURUI branding"
  );
});

test("Workflow: email nodes are updated to SirHansFelix branding", () => {
  const data = JSON.parse(fs.readFileSync(workflowPath, "utf8"));
  const emailQualified = data.nodes.find((n: any) => n.name === "Email Qualified Lead");
  const emailNurture = data.nodes.find((n: any) => n.name === "Email Nurture Lead");

  if (emailQualified) {
    assert.ok(emailQualified.parameters.subject.includes("SirHansFelix"));
    assert.ok(!emailQualified.parameters.subject.includes("NuRui"));
  }
  if (emailNurture) {
    assert.ok(emailNurture.parameters.subject.includes("SirHansFelix"));
    assert.ok(!emailNurture.parameters.subject.includes("NuRui"));
  }
});
