# SirHansFelix n8n Lead Intake System

## What this does

```
Hans site form  →  /api/leads  →  n8n webhook  →  Google Sheets  →  Telegram
```

One workflow, one sheet, one notification. That is the entire Hans demo system.

---

## File

`hans-lead-intake-v1.json` — adapted from NuRui Lead Intake v2. All NuRui strings replaced.

---

## Before you import — gather these values

| Value | Where to find it |
|---|---|
| **Telegram chat ID** | Open Telegram, send a message to @userinfobot, it returns your chat ID |
| **Google Sheets ID** | Create a new sheet → copy the ID from the URL: `docs.google.com/spreadsheets/d/SHEET_ID/` |
| **Hans booking link** | Hans's Google Calendar appointment scheduling link |

---

## Import steps

1. In n8n → **Workflows** → **Import from file** → select `hans-lead-intake-v1.json`
2. The workflow will import in **inactive** state — do not activate yet.

---

## Configure after import (touch these 4 things only)

### 1. Webhook node — "Receive Website Lead"
- Path is already set to `hans-leads` ✅
- Copy the **production webhook URL** (toggle to Production mode first): `https://your-n8n/webhook/hans-leads`
- Paste this URL into Vercel → Environment Variables → `LEAD_WEBHOOK_URL`

### 2. Google Sheets nodes (3 nodes: "Save Lead", "Save Qualified Email Status", "Save Nurture Email Status")
- Click each node → select your Google Sheets credential
- Replace `PASTE_HANS_SPREADSHEET_ID_HERE` with your actual sheet ID
- Select sheet tab: **Applications**

### 3. Gmail nodes (2 nodes: "Email Qualified Lead", "Email Nurture Lead")
- Select Hans's Gmail credential
- In "Email Qualified Lead" body: replace `PASTE_HANS_BOOKING_LINK_HERE` with Hans's actual booking link

### 4. Telegram nodes (4 nodes: all Alert nodes)
- Select Hans's Telegram Bot credential
- Replace `PASTE_HANS_TELEGRAM_CHAT_ID_HERE` with Hans's actual chat ID (just the number, e.g. `12345678`)

---

## Google Sheet — Required columns (Applications tab)

Create a tab named exactly `Applications` with these headers in row 1:

```
leadId | submittedAt | source | pageUrl | referrer | userAgent | leadScore | name | email | contactHandle | experience | market | interest | problem | nextStep | chosenPlan | qualificationStatus | emailStatus | bookingStatus | followUpStage | nextFollowUpAt | lastContactedAt | stoppedReason | appointmentStart | appointmentEventId
```

---

## Test before activating

1. Activate the workflow (toggle at top right)
2. Submit a **high-score test lead** from the website:
   - Experience: Advanced, NextStep: book-call → score ≥ 7 → Qualified path
3. Check:
   - ✅ Row appears in Google Sheet
   - ✅ Telegram alert fires to Hans's chat
   - ✅ Qualified email arrives at the test email address
4. Submit a **low-score test lead**:
   - Experience: Beginner, NextStep: see-pricing → score ~3 → Nurture path
5. Check:
   - ✅ Row appears in Google Sheet (qualificationStatus = Nurture)
   - ✅ Nurture Telegram alert fires
   - ✅ Nurture email arrives

---

## Workflows NOT needed for the demo

These are NuRui-specific and should remain inactive:

- `NuRui Booking Monitor V2` — Calendar-triggered booking detection
- `NuRui Non-Booker Follow-Up v1` — Day 1/3/7 reminder emails
- `NuRui 24H Appointment Reminder v1`
- `NuRui 1H Appointment Reminder v1`
- `NuRui Post-Call Follow-Up v1`

These can be adapted for Hans later if needed.

---

## Emergency pause

If anything unexpected happens, deactivate **SirHansFelix Lead Intake v1** in n8n.
The form will return a 503 "setup mode" error instead of submitting. No data is lost.
