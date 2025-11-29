# Architecture Overview

- **UI shell** – React (functional components + hooks) bootstrapped via Vite. Shared components live in `src/components` and consume feature modules.
- **Feature modules** – Domain logic is grouped under `src/modules/<feature>` (e.g., `geolocation`, `search`). Each module exposes `hooks`, `services`, and `types` to keep responsibilities isolated.
- **Data fetching** – `@tanstack/react-query` coordinates async requests and caching. Hooks wrap services so UI components stay declarative.
- **Geo helpers** – Utilities that can be reused across modules live in `src/lib` (bounds formatting, area extraction, etc.).
- **Testing pyramid** – Unit specs cover services and helpers, integration specs cover cross-module behavior, and Playwright tests guard the main flow.
