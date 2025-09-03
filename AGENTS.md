# Repository Guidelines

## Project Structure & Module Organization
- frontend: React + Vite + TypeScript UI (`frontend/src`), assets in `frontend/public` and `src/styles`/`components`.
- backend: Express + TypeScript API (`backend/src`), routes in `src/routes`, middleware in `src/middleware`, config in `src/config`.
- scripts: deployment/build helpers (`scripts/*.sh`, `scripts/*.bat`).
- infra: Dockerfiles, `docker-compose*.yml`, `nginx/`, `redis/`, `monitoring/`.
- docs: additional guides in `docs/`. Art and data in `database/` and `memory/`.

## Build, Test, and Development Commands
- Install all: `npm run install:all` (root, frontend, backend).
- Dev (concurrent): `npm run dev` (frontend + backend together).
- Frontend: `cd frontend && npm run dev | build | preview`.
- Backend: `cd backend && npm run dev | build | start`.
- Lint: `npm run lint` (root runs both apps) or per-app `lint`/`lint:fix`.
- Build (both): `npm run build`. Production (Windows): `npm run build:production:windows`.
- Docker (dev): `npm run docker:dev` / down: `npm run docker:dev:down`.
- Health check: `npm run health:check` (expects API on 5000).

## Coding Style & Naming Conventions
- Language: TypeScript (Node 18+). Indentation: 2 spaces; semicolons on; prefer `const`.
- React: Components `PascalCase` in `frontend/src/components`, hooks `useX` in `src/hooks`.
- Files: `.tsx` for components, `.ts` for utilities/types; backend files in `backend/src` use `camelCase` filenames.
- Linting: ESLint configured in both apps; keep builds type-clean (`tsc --noEmit`). Tailwind used in frontend.

## Testing Guidelines
- Backend: Jest + Supertest (`npm run test:backend`). Place tests near sources or in `__tests__` with `*.test.ts`.
- Frontend: No unit test script defined; use `npm run type-check`, `npm run lint`, and `npm run test:build` for smoke.
- Aim for coverage on critical routes (`src/routes/*`) and middleware.

## Commit & Pull Request Guidelines
- Commits: Use Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`). Scope optional (e.g., `feat(frontend): add tone selector`).
- PRs: Include clear description, linked issues, screenshots for UI, and notes on testing. Ensure `lint`, `type-check`, and build pass locally.

## Security & Configuration
- Secrets: Do not commit keys. Backend reads `OPENAI_API_KEY`. Use local `.env` and `backend/scripts/generate-secrets.js` if applicable.
- Hardening: See `backend/SECURITY.md`. Prefer `backend/src/server.secure.ts` and secure configs in `backend/src/config` when deploying.
