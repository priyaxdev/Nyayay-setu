# Frontend integration — drop-in files

I don't have your actual `src/` (no `App.tsx`, pages, or routing were
uploaded — only build config), so I couldn't safely edit your real "Text
Complaint" page without risking a duplicate or conflicting implementation.
These two files are written to be dropped into your existing project
as-is once you share it:

- **`api.ts`** — typed fetch wrapper for `/api/chat` and `/api/complaints`.
  Suggested location: `src/lib/api.ts` or `src/services/api.ts`.
- **`useComplaintChat.ts`** — a UI-agnostic hook that owns the
  conversation state, calls the backend, and exposes `sendMessage`,
  `complaintData`, `state`, `missingFields`, and `confirmAndSubmit`.
  Suggested location: `src/hooks/useComplaintChat.ts`.

## Wiring it into your existing "Text Complaint" page

1. Copy both files in, fixing the relative import in
   `useComplaintChat.ts` (`from './api'`) to match wherever you place `api.ts`.
2. In your existing chat component:
   ```tsx
   const chat = useComplaintChat({ language: currentLanguage });
   ```
3. Render `chat.messages` in your existing transcript UI.
4. Wire your existing message input's submit handler to `chat.sendMessage(text)`.
5. When `chat.state === 'READY_FOR_CONFIRMATION'`, show your existing
   summary/review UI populated from `chat.complaintData`, with an edit
   step if you already have one.
6. On the citizen's explicit "Confirm & Submit" click, call
   `await chat.confirmAndSubmit(editedComplaintData)` — this is the only
   place `POST /api/complaints` gets called. Never call it automatically
   when `state` flips to `READY_FOR_CONFIRMATION`.
7. On success, `chat.submittedComplaintId` holds the new `CMP-...` ID —
   show it and route to "My Complaints".
8. In your "My Complaints" page, replace hardcoded data with
   `fetchMyComplaints()` from `api.ts`.

## Environment

Add to your frontend's `.env` (Vite requires the `VITE_` prefix):
```
VITE_API_BASE_URL=http://localhost:5000/api
```

Nothing here changes your existing visual design, colors, or components —
these files only supply data and network calls for whatever UI you already
have.
