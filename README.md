# Unora Web App

Nx monorepo for the Unora frontend and Express backend.

## Layout

- `apps/unora-frontend` - Vite React app
- `apps/unora-backend` - Express API / Vercel serverless backend

## Common commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm test
```

App-specific commands:

```bash
pnpm dev:frontend
pnpm dev:backend
pnpm build:frontend
pnpm build:backend
```

## Vercel

Use two Vercel projects from this monorepo:

- Frontend Root Directory: `apps/unora-frontend`
- Backend Root Directory: `apps/unora-backend`

Each app keeps its own `vercel.json`. The copied configs install dependencies from the workspace root and run the matching Nx target.

Note: generate and commit a root `pnpm-lock.yaml` after activating Node 20+ / pnpm 10+. Until then, the copied Vercel configs use `pnpm install --no-frozen-lockfile` so deployments can still install from the monorepo root.

