<!-- Copilot instructions for contributors and AI coding agents. Keep concise and actionable. -->
# Project Overview & Agent Guidance

This repository contains a small help-ticket application split into two main areas:

- Backend: `PEX2/src` — an Express API that persists data to `PEX2/src/v1/data/Tickets.json` (file-backed DB).
- Frontend: `FrontEnd/HelpTicket` — a Vite + React app that calls the backend at `http://localhost:3002/api/v1/tickets`.

Key facts for an AI agent to be productive quickly:

- Start/Run:
  - Backend (dev): `node src/App.js` run from the `PEX2` folder. Note: `package.json` currently has an incorrect `start` script (`node server.js`) — prefer `node src/App.js`.
  - Frontend (dev): `npm install` then `npm run dev` in `FrontEnd/HelpTicket` (Vite).
  - Frontend build: `npm run build` in `FrontEnd/HelpTicket`.

- API surface (backend routes): `PEX2/src/v1/routes/TicketsRoutes.js`
  - GET `/` — list all tickets
  - GET `/:id` — single ticket (ID validated by middleware)
  - POST `/` — create ticket
  - PUT `/:id` — update ticket
  - DELETE `/:id` — delete ticket
  - GET `/search?q=...` — fuzzy search (uses Fuse.js)

- Data layer: `PEX2/src/v1/data/DataBaseTicket.js` and `storage.js` (reads/writes JSON). When changing schema, update both controller logic and frontend consumption.

- Validation patterns: `PEX2/src/v1/middleware/ticketValidation.js`
  - Title validation regex + length rules (2–100 chars). Keep changes consistent with the frontend UI.
  - Allowed statuses: `"Open"`, `"In Progress"`, `"Closed"` — update both backend validation and frontend dropdowns when changing.

- Search: `ticketController.searchTickets` configures Fuse.js keys: `['title','description','status','id','createdAt','completedAt']`. Frontend expects `json.success` and `json.data`.

- Frontend expectations / patterns:
  - API base used in code: `http://localhost:3002/api/v1/tickets` (hardcoded in components). Update all usages when changing host/port.
  - Components use plain fetch + React state (no global store). Typical files: `src/Components/TicketList.jsx`, `SøkSak.jsx` (search), `NySak.jsx` (create), `SlettSak.jsx`.
  - `SøkSak.jsx` uses debounce, AbortController for request cancellation — preserve that pattern when editing search UX.

- Naming / i18n: source contains Norwegian identifiers/strings (e.g., `SøkSak`, `NySak`). Watch for non-ASCII filenames and exports — some components export ASCII names while files include special characters (e.g., file `SøkSak.jsx` exports `SokSak`). Keep import/export names consistent.

Implementation notes and common gotchas:

- The backend persists to `Tickets.json`. Concurrent writes can race — if you add parallel writes, consider switching to a proper DB or adding write locking.
- `package.json` at `PEX2/package.json` has `main: "Server.js"` and `start: "node server.js"` but actual server code is `src/App.js`. Update `package.json` if adding automated start scripts or deploying.
- The API returns JSON shaped like `{ success: true|false, data: ... }` — frontend relies on this. Preserve `success` flag and `data` structure for compatibility.

Where to change things for common tasks

- Add a new API field: update `DataBaseTicket.js`, `ticketController.js`, `ticketValidation.js`, and the frontend components (`TicketList.jsx`, `TicketDetails.jsx`, forms).
- Change validation rules: update `ticketValidation.js` and adjust frontend validations/placeholders accordingly.
- Change ports or host: update hardcoded URLs in frontend `FrontEnd/HelpTicket/src/Components/*` or centralize into a config file.

Quick examples

- Run backend (from repo root):
```powershell
cd PEX2 ; node src/App.js
```
- Run frontend:
```powershell
cd FrontEnd/HelpTicket ; npm install ; npm run dev
```

Files of interest (start here):

- `PEX2/src/App.js` — express app entry, listens on port 3002
- `PEX2/src/v1/routes/TicketsRoutes.js` — router and endpoints
- `PEX2/src/v1/controllers/ticketController.js` — main API logic (create/read/update/delete + search)
- `PEX2/src/v1/data/*` — file-backed persistence (`Tickets.json`)
- `PEX2/src/v1/middleware/ticketValidation.js` — input validation rules
- `FrontEnd/HelpTicket/src/Components` — UI components interacting with the API

If anything above is unclear or you want me to expand an area (run scripts, fix `package.json` start script, or centralize frontend API base), tell me which change to make and I'll apply it.

-- End of instructions
