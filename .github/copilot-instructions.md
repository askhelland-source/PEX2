<!-- Copilot instructions for contributors and AI coding agents. Keep concise and actionable. -->
# Project Overview & Agent Guidance

This repository contains a small help-ticket application split into two main areas:

- Backend: `PEX2/src` — an Express API that persists data to `PEX2/src/v1/data/Tickets.json` (file-backed DB).
- Frontend: `FrontEnd/HelpTicket` — a Vite + React app that calls the backend at `http://localhost:3002/api/v1/tickets`.

## Key facts for an AI agent to be productive quickly

**Start/Run:**
- Backend (dev): `node src/App.js` from the `PEX2` folder. Note: `package.json` has incorrect `start` script (`node server.js`) — prefer `node src/App.js`.
- Frontend (dev): `npm install` then `npm run dev` in `FrontEnd/HelpTicket` (Vite).
- Frontend build: `npm run build` in `FrontEnd/HelpTicket`.

**API surface** (`PEX2/src/v1/routes/TicketsRoutes.js`):
- GET `/` — list all tickets
- GET `/:id` — single ticket (ID validated by middleware)
- POST `/` — create ticket
- PUT `/:id` — update ticket
- DELETE `/:id` — delete ticket
- GET `/search?q=...` — fuzzy search (uses Fuse.js on keys: `title, description, status, id, createdAt, completedAt`)

**Frontend Architecture** — **NEW**: Custom hook + centralized API pattern
- `FrontEnd/HelpTicket/src/API/Fetch.js` — centralized API utility (`apiGet()`, `apiSend()`) wrapping fetch with error handling.
- `FrontEnd/HelpTicket/src/API/useTicket.js` — custom hook exporting `useTickets()` managing tickets state, CRUD operations, search, optimistic updates.
- Use `useTickets()` in components instead of direct fetch calls; components should import and call hook methods (`fetchAllTickets`, `createTicket`, `updateTicket`, `deleteTicket`, `searchTickets`).
- Example: `SlettSak.jsx` now uses the hook pattern (fetches ticket list, shows dropdown, calls `deleteTicket()` on submission).

**Data layer** (`PEX2/src/v1/data/`):
- `DataBaseTicket.js` — CRUD operations (read, create, update, delete).
- `storage.js` — JSON file read/write. Concurrent writes can race — consider locking if adding parallel writes.
- When changing schema, update: controller logic, middleware validation, and frontend hook.

**Validation patterns** (`PEX2/src/v1/middleware/ticketValidation.js`):
- Title: 2–100 chars, regex allows letters/numbers/Norwegian chars (Åå, Øø, Ææ), punctuation.
- Allowed statuses: `"Open"`, `"In Progress"`, `"Closed"` — update backend AND frontend dropdowns when changing.
- Description: minimum 5 chars, no strict regex (free text).

**API response contract:**
- All endpoints return `{ success: true|false, data: ... }` — frontend relies on this structure.
- Preserve `success` flag and `data` field when modifying endpoints.

**Frontend patterns / naming:**
- Norwegian identifiers: `SøkSak` (search), `NySak` (create), `SlettSak` (delete), `TicketList`, `TicketDetails`.
- File `SøkSak.jsx` exports `SokSak` (ASCII alias); watch for inconsistencies.
- Components in `src/Components/` and page-level routes in `src/Pages/`.
- `SøkSak.jsx` uses debounce + AbortController for search UX — preserve pattern when editing.

## Common tasks & where to edit

- **Add a new ticket field:** update `DataBaseTicket.js` schema, `ticketValidation.js` rules, `ticketController.js` handling, frontend form components, and `useTicket.js` hook if needed.
- **Change validation rules:** edit `ticketValidation.js` (backend) + frontend form UI.
- **Change API base URL or port:** update `BASE_URL` in `Fetch.js` (single source of truth).
- **Refactor components to use hook:** replace `fetch()` calls with `useTickets()` methods; see `SlettSak.jsx` as example.

## Implementation notes

- Backend persists to `Tickets.json`; concurrent writes can race. Consider switching to DB or adding write locking for concurrent operations.
- `PEX2/package.json` has `main: "Server.js"` and `start: "node server.js"` but actual entry is `src/App.js`. Update if deploying.
- Deletion endpoint (`DELETE /:id`) returns HTTP 204 (no content) — `apiSend()` in `Fetch.js` handles this by returning `{}`.

## Files of interest (start here)

**Backend:**
- `PEX2/src/App.js` — Express app entry, listens on port 3002
- `PEX2/src/v1/routes/TicketsRoutes.js` — router with middleware validation
- `PEX2/src/v1/controllers/ticketController.js` — CRUD + search logic using Fuse.js
- `PEX2/src/v1/data/` — file-backed persistence
- `PEX2/src/v1/middleware/ticketValidation.js` — validation rules

**Frontend:**
- `FrontEnd/HelpTicket/src/API/Fetch.js` — centralized API wrapper
- `FrontEnd/HelpTicket/src/API/useTicket.js` — custom hook for state management
- `FrontEnd/HelpTicket/src/Components/SlettSak.jsx` — example of hook usage (delete with dropdown)
- `FrontEnd/HelpTicket/src/Components/SøkSak.jsx` — search component with debounce
- `FrontEnd/HelpTicket/src/Components/TicketList.jsx` — main list view

-- End of instructions
