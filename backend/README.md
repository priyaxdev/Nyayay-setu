# Nyayay-Setu Backend

Node.js + Express + MongoDB backend for the citizen complaint/FIR assistance
chatbot. This covers the first vertical slice only:

```
Citizen → Chatbot → Follow-up questions → Structured complaint →
Confirmation → POST /api/complaints → MongoDB → Complaint ID →
My Complaints → Complaint Status
```

Police dashboard and FIR generation are explicitly out of scope for now.

## Architecture

```
server/
├── server.js                  Express app entry point
├── routes/
│   ├── chat.routes.js         POST /api/chat
│   └── complaint.routes.js    POST/GET/PATCH /api/complaints
├── controllers/                Request validation + response shaping
│   ├── chat.controller.js
│   └── complaint.controller.js
├── services/                   Business logic, DB access, AI logic
│   ├── ai.service.js          ← real AI integration point, see below
│   └── complaint.service.js
├── models/
│   ├── Complaint.js
│   └── Counter.js              backs atomic human-readable complaint IDs
├── middleware/
│   └── error.middleware.js     404 handler + centralized error handler
├── utils/
│   ├── complaintId.js          CMP-YYYY-NNNNNN generator
│   ├── asyncHandler.js
│   └── ApiError.js
└── config/
    └── db.js                   Mongo connection
```

The backend is stateless between requests: the frontend sends the running
`conversationHistory` (and the last `complaintData`) with every `/api/chat`
call, and the mock AI replays it to reconstruct where the conversation is.
This keeps a persistence layer for conversations optional for now — see
"Adding conversation persistence" below.

## Setup

```bash
cd server
npm install
cp .env.example .env
# edit .env — at minimum set MONGODB_URI to a running MongoDB instance
npm run dev
```

The API listens on `http://localhost:5000` by default (`PORT` in `.env`).

You need a MongoDB instance reachable at `MONGODB_URI` — a free
[MongoDB Atlas](https://www.mongodb.com/atlas) cluster or a local
`mongod` both work.

## Environment variables

| Variable          | Required | Description                                          |
|--------------------|----------|-------------------------------------------------------|
| `PORT`             | no       | Defaults to `5000`                                    |
| `MONGODB_URI`      | yes      | Mongo connection string                                |
| `FRONTEND_ORIGIN`  | no       | CORS origin, defaults to `http://localhost:5173`       |
| `AI_PROVIDER`      | no       | `mock` (default) or your real provider name once wired |
| `OPENAI_API_KEY`   | only if using a real provider | Never committed, never sent to the frontend |

## API reference

All responses follow `{ success: boolean, ... }`; errors are
`{ success: false, message: string }`.

### `GET /api/health`
```json
{ "success": true, "message": "Nyayay-Setu API is running" }
```

### `POST /api/chat`
Request:
```json
{
  "conversationId": "conv_123",
  "message": "My phone was stolen yesterday evening near Kashmere Gate Metro Station.",
  "language": "en",
  "conversationHistory": [],
  "currentComplaintData": null
}
```
Response:
```json
{
  "success": true,
  "conversationId": "conv_123",
  "reply": "Do you know anything about the person involved?",
  "state": "COLLECTING",
  "complaintData": {
    "incidentType": "theft",
    "description": "mobile phone was reported stolen",
    "date": "2026-08-23",
    "time": "evening",
    "location": "Kashmere Gate Metro Station",
    "stolenItem": "mobile phone",
    "language": "en"
  },
  "missingFields": []
}
```
Once every field the flow cares about has been asked (even if the answer
was "I don't know" → stored as `null`), `state` becomes
`READY_FOR_CONFIRMATION`. The frontend should show the summary and only
call `/api/complaints` after the citizen explicitly confirms — the backend
never auto-submits.

### `POST /api/complaints`
Request:
```json
{
  "conversationId": "conv_123",
  "complaintData": {
    "incidentType": "theft",
    "description": "mobile phone was reported stolen",
    "date": "2026-08-23",
    "time": "evening",
    "location": "Kashmere Gate Metro Station",
    "stolenItem": "mobile phone",
    "language": "en"
  }
}
```
Requires at least `incidentType` and `description`; every other field may
be `null`. Response:
```json
{
  "success": true,
  "complaint": {
    "complaintId": "CMP-2026-000001",
    "status": "SUBMITTED",
    "...": "..."
  }
}
```

### `GET /api/complaints?userId=...`
Returns `{ success: true, complaints: [...] }`. `userId` is optional until
auth exists — omit it to get everything (fine for local dev/testing only).

### `GET /api/complaints/:complaintId`
Returns `{ success: true, complaint: {...} }` or 404.

### `PATCH /api/complaints/:complaintId/status`
Request: `{ "status": "UNDER_REVIEW" }`. Status must be one of
`SUBMITTED | UNDER_REVIEW | FIR_DRAFT_GENERATED | OFFICER_VERIFICATION | FIR_REGISTERED | CLOSED`.
This exists for the future police dashboard — nothing calls it yet.

## How MOCK_AI works

With `AI_PROVIDER=mock` (the default), `services/ai.service.js` runs a
small keyword/regex-based extractor instead of calling a real model. It:

- Detects incident type (theft, assault, harassment, fraud, lost property, accident) from free text
- Pulls out dates ("yesterday", "today", explicit dates), time-of-day, and locations (`near X`, `at X`, ...)
- Asks one follow-up question at a time for whatever's still missing
- Treats "I don't know" / "not sure" as an explicit `null` rather than guessing
- Flips to `READY_FOR_CONFIRMATION` once nothing's left to ask

It's good enough to exercise the entire frontend↔backend↔DB pipeline
end-to-end without any API key.

## Where to add your real AI integration

Open `services/ai.service.js` and implement `processWithRealAI()`. It must
resolve to the same shape the mock returns:

```js
{ reply, state, complaintData, missingFields }
```

Then set `AI_PROVIDER` in `.env` to anything other than `mock`. Nothing
else in the codebase needs to change — routes/controllers only ever call
`processComplaintMessage()`, which already dispatches to whichever
provider is configured.

Do not read the API key anywhere outside that function, and never return
or log it.

## Adding conversation persistence later

Right now `conversationId` is generated client-side and conversation
history lives in the frontend's state. To persist it: add a
`Conversation` model (`conversationId`, `messages[]`, `complaintData`),
save/load it in `chat.controller.js` instead of trusting
`conversationHistory` from the request body, and stop requiring the
frontend to resend the full history each turn.

## CORS

`FRONTEND_ORIGIN` controls the allowed origin (defaults to the Vite dev
server at `http://localhost:5173`). Update it for your deployed frontend
URL in production.
