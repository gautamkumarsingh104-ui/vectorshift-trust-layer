# VectorShift Trust Layer — Interactive Prototype

A self-contained demo of VectorShift's **Trust Layer** feature: source-linked outputs and guarded write actions.

## Quick Start

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## Demo Flow (for screen recording)

1. **Trust Layer ON** (default) — click 2–3 underlined citation spans to open source evidence
2. **Approve** the first guarded action (Salesforce risk score)
3. **Edit value → Save & Approve** the second action (HubSpot task)
4. **Deny** the third action (Slack message) with a reason
5. Expand the **Audit Trail** at the bottom
6. Toggle **Trust Layer OFF** — citations disappear, actions auto-execute
7. Toggle back **ON** to restore the guarded state

## Customize Demo Content

Edit **`src/mockData.js`** — all sample text lives in one file:

| What to change | Variable |
|---|---|
| Summary text & citation spans | `summarySegments` |
| Citation source details | `citations` |
| Guarded write actions | `guardedActions` |
| Pipeline name | `PIPELINE_NAME` |
| Approver name in audit log | `CURRENT_USER` |
