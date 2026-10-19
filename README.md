# Bupa Books

React + TypeScript (Vite) app that fetches book owners from the Bupa coding test API and
displays books alphabetically, grouped by owner age category.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit + component tests (Vitest, Testing Library)
npm run test:e2e   # end-to-end tests (Playwright; API is mocked)
npm run lint       # ESLint
npm run format     # Prettier
npm run build      # type-check + production build into dist/
```

First time running e2e: `npx playwright install chromium`. CI (`.github/workflows/ci.yml`) runs lint, format check,
typecheck, unit tests, build and e2e on every push and pull request.

## Features

- **Get Books**: fetches the data and shows all books under _Books owned by Adults_ / _Books owned by Children_, sorted A-Z.
- **Hardcover only**: shows only hardcover books; headings become _Hardcover Books owned by Adults / Children_.
- Responsive layout with a mobile breakpoint at 600px. Primary colour `#0079c8`.
- Loading and error states, accessible buttons (`aria-pressed`), live region for results, visible keyboard focus.

## Structure

```
src/
  api/bookOwners.ts        fetch + response validation
  hooks/useBookOwners.ts   loading state, aborts stale requests
  utils/groupBooks.ts      pure grouping / filtering / sorting logic (unit tested)
  components/BookGroup.tsx heading + list
  App.tsx / App.css        page, filter state, styling
```

## Decisions

- **Vite + TypeScript** instead of Create React App (deprecated): fast, minimal config, typed API data.
- **Fetch once, filter on the client**: "Hardcover only" reuses loaded data, so toggling is instant. "Get Books" refetches for fresh data.
- **Pure `groupBooks` function**: all business rules (age split, hardcover filter, sorting) live in one tested place, separate from React.
- **Hook aborts stale requests** so a slow earlier response can't overwrite a newer one.
- **No UI library or state library**: the problem is small; plain CSS with one breakpoint (600px) is easier to review.
- **Mocked API in e2e tests**: fast and deterministic. A smoke test against the live API could be added as a separate CI job.
- **Errors are recoverable**: clear message plus a "Try again" button.

## Assumptions

1. **Endpoint**: `GET /api/v1/bookowners` on `https://digitalcodingtest.bupa.com.au`, returning
   `[{ name, age, books: [{ name, type }] }]`. I couldn't read the Swagger page (it renders client-side),
   so **confirm the path in the Swagger UI** and change `VITE_API_URL` / the default in `src/api/bookOwners.ts` if it differs.
2. **Hardcover** is matched on `type === "Hardcover"`, case-insensitive.
3. **Adults** are age >= 18, **Children** are age <= 17. Owners with a missing/invalid age are skipped.
4. Owners with `books: null` are treated as having no books.
5. Sorting is case-insensitive A-Z. If two owners own the same title, it is listed twice (one entry per owned copy).
6. The brief mentions a server side in the original page, but this challenge asks only for fetch + display, so the app
   calls the API directly from the client.

## Before production

- **CORS**: in development Vite proxies `/api` to avoid CORS. In production either confirm the API allows your origin,
  set `VITE_API_URL`, or serve the app behind a reverse proxy / BFF that forwards `/api`.
- Deploy from CI (e.g. to a static host/CDN) with environment-specific `VITE_API_URL`.
- Add request timeouts/retry, error monitoring (e.g. Sentry) and security headers (CSP) at the host.
- Run an accessibility audit (Lighthouse/axe) and a live-API smoke test.
- Consider runtime schema validation (e.g. Zod) if the API contract is not guaranteed.
