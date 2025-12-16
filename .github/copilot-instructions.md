<!-- Copilot instructions for contributors and AI coding agents. Keep concise and actionable. -->
# Project Overview & Agent Guidance

This repository contains a small help-ticket application split into two main areas:

- **Backend**: `PEX2/src` — an Express API that persists data to `PEX2/src/v1/data/Tickets.json` (file-backed DB).
- **Frontend**: `FrontEnd/HelpTicket` — a Vite + React app with React Router that calls the backend at `http://localhost:3002/api/v1/tickets`.

## Quick Start

**Backend (dev):**
```bash
cd PEX2
node src/App.js
# Listens on http://localhost:3002/api/v1/tickets
```

**Frontend (dev):**
```bash
cd FrontEnd/HelpTicket
npm install  # Install react-router-dom if not already installed
npm run dev
# Dev server on http://localhost:5173 (Vite)
```

## Frontend Architecture

**Routing** (`App.jsx` + `Pages/`, `Components/NavBar.jsx`):
- Router wraps app; ErrorProvider outside Router to persist errors across navigation
- Routes: `/Dashboard` (home), `/MakeTicket` (create), `/SeeTickets` (all tickets), `/YourTickets` (helping view)
- NavBar provides Link navigation; each page imports components as needed

**State Management** (custom hook pattern):
- `API/useTickets()` — centralized hook with `fetchAllTickets()`, `createTicket()`, `updateTicket()`, `deleteTicket()`, `searchTickets()`
- `API/Fetch.js` — centralized HTTP layer (BASE_URL, `apiGet()`, `apiSend()`)
- `Contexts/ErrorContext.jsx` — global error state; auto-dismiss after 5s; accessed via `useErrorHandler()` hook
- All components use `useTickets()` and `useErrorHandler()` instead of direct fetch/alert calls

**Page Structure**:
- `/Dashboard` — landing page with navigation to other pages
- `/MakeTicket` (CreateTicket.jsx) — create new ticket form
- `/SeeTickets` (ViewTicket.jsx) — displays TicketList with sort/filter/pagination
- `/YourTickets` (YourTickets.jsx) — (to be implemented/wired)

**Components**:
- `TicketList.jsx` — main list with sorting (newest/oldest/A-Z), filtering (by status), pagination (15 items/page)
- `TicketDetails.jsx` — detail modal with edit/delete, shows timestamps, status dropdown
- `NySak.jsx` — create ticket form
- `SlettSak.jsx` — delete by dropdown selector
- `SøkSak.jsx` — search with debounce + AbortController, 2-char minimum

**Utilities**:
- `Utils/ticketSortFilter.js` — SortOptions enum, sortTickets(), filterByStatus(), getSortLabel() (Norwegian labels)
- `Utils/pagination.js` — getPaginatedItems() (returns paged items + metadata), getPageNumbers() (with ellipsis)
- `Hooks/useErrorHandler.js` — hook exporting handleError() and addError() convenience methods

## Backend API

**Surface** (`v1/routes/TicketsRoutes.js`):
- `GET /` — list all tickets
- `GET /:id` — single ticket (ID validated by middleware)
- `POST /` — create ticket
- `PUT /:id` — update ticket
- `DELETE /:id` — delete ticket (returns 204 No Content; frontend's `apiSend()` converts to `{}`)
- `GET /search?q=...` — fuzzy search using Fuse.js (searches: title, description, status, id, createdAt, completedAt)

**Response Contract**:
All endpoints return `{ success: true|false, data: ... }`. Frontend code depends on this structure.

**Validation** (`v1/middleware/ticketValidation.js`):
- Title: 2–100 chars, allows Norwegian chars (Åå, Øø, Ææ) + punctuation
- Status: only `"Open"`, `"In Progress"`, `"Closed"` (update backend AND frontend dropdowns together)
- Description: 5+ chars, free text

**Data Layer** (`v1/data/`):
- `DataBaseTicket.js` — CRUD operations (read, create, update, delete)
- `storage.js` — JSON file I/O; concurrent writes can race—consider locking if adding parallel operations

## Common Tasks

- **Add a new ticket field**: update `DataBaseTicket.js` schema → `ticketValidation.js` rules → `ticketController.js` handling → form in `NySak.jsx` → `useTickets.js` hook if needed
- **Change validation rules**: edit `ticketValidation.js` (backend) + form UI (frontend)
- **Change API base URL**: update `BASE_URL` in `Fetch.js` (single source of truth)
- **Migrate component to use hook**: replace direct fetch with `useTickets()` methods; see `SlettSak.jsx` as example
- **Add new page/route**: create file in `Pages/`, add Route in `App.jsx`, add Link in `NavBar.jsx` or destination page
- **Handle errors in new component**: wrap API calls with `useErrorHandler().handleError()` instead of try/catch + alert

## Implementation Notes

- Frontend sorted tickets default to NEWEST; filters default to 'All' status
- TicketDetails error messages use `addError("Saken ble oppdatert!", "success")` but display in red toast (UI limitation—may want separate success toast later)
- Search (SøkSak) maintains separate `searchResults` state, not global hook state
- NavBar imports CSS from `Styling/NavBar.css` (CSS modules in separate folder)
- Package.json typo: `CreateTicekt` imported in App.jsx (should be `CreateTicket` when fixed)
- Backend persists to `Tickets.json`; file-backed DB may have race conditions under heavy concurrent load

## Files of Interest

**Backend**: `PEX2/src/App.js` | `v1/routes/TicketsRoutes.js` | `v1/controllers/ticketController.js` | `v1/data/DataBaseTicket.js` | `v1/middleware/ticketValidation.js`

**Frontend**: `src/App.jsx` | `API/Fetch.js` | `API/useTicket.js` | `Contexts/ErrorContext.jsx` | `Hooks/useErrorHandler.js` | `Components/TicketList.jsx` | `Components/TicketDetails.jsx` | `Pages/Dashboard.jsx`

