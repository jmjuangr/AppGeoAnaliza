# AppGeoAnaliza

A Vite + React + TypeScript starter focused on geo-analysis workflows guided by `AGENTS.md`. Use it to explore Google Maps Platform data (Geolocation, Geocoding, Places) with modular front-end organization and strong testing defaults.

## Getting Started

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and provide the Google Maps Platform key(s) before hitting APIs.

## Available Scripts

- `npm run dev` – Vite dev server with hot reload.
- `npm run build` – Type-check then build production bundle.
- `npm run preview` – Serve the `dist/` build locally.
- `npm run lint` – ESLint + Prettier validation.
- `npm run test` – Vitest in watch mode.
- `npm run test:ci` – Vitest run with coverage output.
- `npm run test:e2e` – Playwright end-to-end tests (requires `npm run build`).

See `AGENTS.md` for project-wide conventions and architecture guidance.
