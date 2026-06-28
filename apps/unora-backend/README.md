# Unora API (backend)

Production-minded **Express** + TypeScript service for the Unora dating app. This repository is intended to live next to `unora-frontend` (sibling folder under the same parent directory). Domain logic is framework-agnostic (`src/modules/**`, `src/db/**`, `src/config/**`); only `src/app.ts` and `src/routes/**` are Express-specific, so swapping the HTTP stack later does not require rewriting auth or persistence.

## Requirements

- Node.js 20 LTS
- [pnpm](https://pnpm.io/installation) 10+ (`corepack enable`; `package.json` pins the version via `packageManager`)
- **PostgreSQL** and **Redis** reachable from your machine (Docker Compose is one way; see below)

The API process **exits on startup** if Redis is unreachable (OTP, rate limits, and Redis-backed HTTP rate limiting depend on it).

### If `docker` is not installed (or “command not found”)

1. **Install Docker** (includes Compose): [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/). Then open Docker Desktop once so the `docker` CLI is on your `PATH`, and run `docker compose up -d redis` (and Postgres if you need it).

2. **Or run Redis without Docker (macOS / Homebrew)**  
   ```bash
   brew install redis
   brew services start redis
   ```  
   Default URL `redis://127.0.0.1:6379` matches `.env.example`. For Postgres without Docker: `brew install postgresql@16`, follow `brew info postgresql@16` to start the service, then set `DATABASE_URL` in `.env` to match your local user/database.

3. **Or use a hosted Redis** (e.g. your team’s dev instance) and set `REDIS_URL` in `.env`.

## Quick start (Docker Compose)

```bash
cp .env.example .env
# edit secrets in .env (JWT_ACCESS_SECRET, OTP_PEPPER, GOOGLE_CLIENT_IDS)

docker compose up --build
```

- HTTP API: `http://localhost:8000`
- OpenAPI UI: `http://localhost:8000/docs` (toggle with `ENABLE_OPENAPI_UI`)
- Health: `GET /health`

Local migrations run automatically in the API container before `node dist/server.js`.

For host development against Compose databases:

```bash
cp .env.example .env
# fill in secrets; optional overrides in `.env.local` (loaded after `.env`)
pnpm install
pnpm db:migrate
pnpm dev
```

Postgres is published on **host port 5433** (not 5432) so it does not collide with a local PostgreSQL install. Set `DATABASE_URL=postgresql://unora:unora@127.0.0.1:5433/unora` in `.env` when using Compose this way.

The server loads `.env` then `.env.local` from the repo root before validating configuration (see `src/config/loadDotenv.ts`). It does not override variables already set in the shell or container environment.

**Production template:** copy **`env.prod.example`** → **`env.prod`** (gitignored), fill in secrets and **internal** Render URLs where applicable, then paste the same keys into the **Render** or **Vercel** environment UI. The example file explains **Render internal** `DATABASE_URL` / `REDIS_URL` vs **Vercel** (must use URLs reachable from the public internet).

## Deploy on [Render](https://render.com)

The repo includes a **`render.yaml`** [Blueprint](https://render.com/docs/infrastructure-as-code) that provisions **Render Postgres**, a **Key Value (Redis)** instance (private network only), and a **Docker** web service. The **`Dockerfile`** runs **`node dist/db/migrate.js`** before **`node dist/server.js`**, so schema is applied on each deploy.

### 1. Blueprint (recommended)

1. Push this repository to GitHub (or GitLab/Bitbucket supported by Render).
2. In the Render dashboard: **New** → **Blueprint** → select the repo → confirm resources from `render.yaml`.
3. When prompted, set **secret** (or **sync**) environment variables:
   - **`GOOGLE_CLIENT_IDS`** — comma-separated OAuth client IDs (Web / iOS / Android as needed).
   - **`CORS_ORIGINS`** — comma-separated allowed browser origins, e.g. `https://your-app.onrender.com,https://www.yourdomain.com` (include every frontend origin that calls the API with cookies or credentialed fetches).
   - **`PUBLIC_MEDIA_BASE_URL`** — public base URL for profile photo links **with no trailing slash**. If you use **`USER_PHOTOS_STORAGE=local`** (default in the blueprint), set this to `https://<your-web-service-host>/v1/media` (same host as the API). For serverless or no disk, use **`USER_PHOTOS_STORAGE=postgres`** (images in the database) with the same **`/v1/media`** base, or use **`USER_PHOTOS_STORAGE=s3`**, **`S3_*`**, and a bucket or CDN base in **`PUBLIC_MEDIA_BASE_URL`** (see [Profile photos](#profile-photos-media)).

4. After the first successful deploy, open **`GET /health`** on the service URL to confirm the service is up.

### Troubleshooting: `Invalid environment` / `Required` during deploy

The **`Dockerfile`** runs **`node dist/db/migrate.js`** on startup. That script calls **`loadEnv`** and needs the **same variables** as the running API. If logs show:

`Error: Invalid environment: {"DATABASE_URL":["Required"], ...}`

then the **web service** does not have those keys set at **runtime**. Common causes:

| Symptom | What to do |
| -------- | ----------- |
| You used **New → Web Service → Docker** (not **Blueprint**) | Postgres/Redis do **not** auto-attach. In the web service → **Environment**, add **`DATABASE_URL`** (from your Render Postgres **Connect** / internal URL) and **`REDIS_URL`** (from **Key Value** → connection string / internal URL). Same region is best. |
| **`GOOGLE_CLIENT_IDS`** is required | Set it to a non-empty comma-separated list of Google OAuth client IDs (from Google Cloud Console). Blueprint `sync: false` means you must enter it when prompted, or add it later in **Environment**. |
| **`JWT_ACCESS_SECRET`** / **`OTP_PEPPER`** missing | In **Environment**, add secrets: **`JWT_ACCESS_SECRET`** ≥ 32 characters, **`OTP_PEPPER`** ≥ 16 characters (e.g. `openssl rand -base64 32`). If you use the Blueprint, `generateValue` should create them—if not, set them manually. |
| Blueprint renamed or resources created separately | **`fromDatabase`** / **`fromService`** only wire env when those resources are created **with** the Blueprint. Open **Environment** on **`unora-backend`** and confirm **`DATABASE_URL`** and **`REDIS_URL`** are present (not blank). |

### 2. Manual Docker web service (no Blueprint)

Create **PostgreSQL** and **Key Value** (Redis) in the same region, then a **Web Service** with **Docker** and this repository. Set **Dockerfile path** to `./Dockerfile`, **health check path** to `/health`, and wire **`DATABASE_URL`**, **`REDIS_URL`**, and the same secrets as in the [Requirements](#requirements) / env sections below. Render injects **`PORT`**; the app reads it automatically.

### 3. Native Node build (alternative to Docker)

If you prefer Render’s **Node** runtime instead of Docker:

- **Build command:** `corepack enable && corepack prepare pnpm@10.33.0 --activate && pnpm install --frozen-lockfile && pnpm run build`
- **Start command:** `pnpm run start:prod` (runs compiled migrations, then the server; requires `pnpm` on PATH from `corepack` in the same start script, or use `node dist/db/migrate.js && node dist/server.js` after a build-only install).

### Render-specific settings

| Variable | Suggested value on Render |
| -------- | ------------------------- |
| **`NODE_ENV`** | `production` |
| **`TRUST_PROXY`** | `true` — Render terminates TLS; needed for correct client IP and `REQUIRE_HTTPS` / `X-Forwarded-Proto`. |
| **`TRUST_PROXY_HOPS`** | `1` (default) — number of trusted proxy hops passed to Express `trust proxy` (avoids boolean `true`, which `express-rate-limit` rejects). Raise only if another proxy sits in front of Render. |
| **`REQUIRE_HTTPS`** | `true` — reject requests that do not look like HTTPS from the edge. |
| **`DATABASE_URL`** | From managed Postgres (internal URL is fine for the web service in the same account/region). |
| **`REDIS_URL`** | From Key Value / Redis (`redis://…`; use internal connection string when offered). |
| **`ENABLE_OPENAPI_UI`** | `false` in production unless you want `/docs` public. |

**Ephemeral disk:** Render web instances do **not** keep a writable disk across restarts. **`USER_PHOTOS_STORAGE=local`** is only suitable for demos; use **`USER_PHOTOS_STORAGE=postgres`** or **S3** (`s3`) for real profile photos.

## Deploy on [Vercel](https://vercel.com)

This API is a **long-lived Express** app by default (`pnpm start`). Vercel runs it as a **Node serverless function** via **`api/index.ts`** and **`vercel.json`** rewrites (all paths → `/api`).

### Setup

1. Import the repo in Vercel (**Add New… → Project**).
2. **Root directory:** repository root (where `vercel.json` lives).
3. **Environment variables:** add the same keys you use in production (`DATABASE_URL`, `REDIS_URL`, `JWT_ACCESS_SECRET`, `OTP_PEPPER`, `GOOGLE_CLIENT_IDS`, `CORS_ORIGINS`, `PUBLIC_MEDIA_BASE_URL`, `REQUIRE_HTTPS`, media/S3 vars, etc.). **`TRUST_PROXY`** can be omitted on Vercel (see step 5). Enable them for **Production** and **Preview** as needed.
4. **`vercel.json`** uses:
   - **`installCommand`**: enables **pnpm** via Corepack (matches `package.json#packageManager`).
   - **`buildCommand`**: `pnpm run build` then **`node dist/db/migrate.js`** so migrations run when `DATABASE_URL` is available at build time. If you migrate elsewhere, override the build command in the Vercel UI to `pnpm run build` only.
5. **`TRUST_PROXY`**: if unset and **`VERCEL`** is present, the app defaults **`TRUST_PROXY` to `true`**. Express uses **`trust proxy` = `TRUST_PROXY_HOPS`** (default **`1`**, not boolean `true`). Rate limiters also disable **`express-rate-limit`** proxy header validations that still misfire on some serverless adapters (see **`ERR_ERL_*`** in their docs). **`REQUIRE_HTTPS=true`** is recommended behind Vercel’s edge (same reasons as Render).
6. **Profile photos:** Vercel has **no durable local disk** for `USER_PHOTOS_STORAGE=local`. Use **`USER_PHOTOS_STORAGE=postgres`** and set **`PUBLIC_MEDIA_BASE_URL`** to this API’s **`/v1/media`** on your Vercel URL (or custom domain), or use **`USER_PHOTOS_STORAGE=s3`** with **`S3_*`** and a public URL to the objects. The app **fails fast** on Vercel if `local` is left on.

### Postgres and Redis on Vercel (step by step)

Vercel **does not** host Postgres or Redis inside your project. You attach **external** databases, then copy connection strings into **Vercel → your project → Settings → Environment Variables**.

This API reads exactly:

| Variable | What it must be |
| -------- | ---------------- |
| **`DATABASE_URL`** | A Postgres URI starting with `postgresql://` or `postgres://` (used by `pg` / Drizzle). |
| **`REDIS_URL`** | A Redis URI starting with `redis://` or `rediss://` (used by **ioredis** over TCP). **Not** Upstash REST-only variables (`UPSTASH_REDIS_REST_URL` alone is not enough unless you also set `REDIS_URL` to the TCP URL from Upstash). |

Use **Production** (and **Preview** if you want preview deploys to work) when saving variables.

---

#### A) Postgres with **Neon** (common with Vercel)

1. Go to [https://neon.tech](https://neon.tech) and sign in (or use **Vercel → your project → Storage** and create a Neon database from the Vercel UI if you prefer the [managed integration](https://neon.tech/docs/guides/vercel-native-integration)).
2. In Neon, create a **project** and a **branch** (e.g. `main`).
3. Open **Dashboard → Connection details** (or **Connect**).
4. Copy the connection string intended for **serverless** / **pooled** access if Neon offers both (many short-lived connections from Vercel benefit from pooling).
5. In **Vercel → Project → Settings → Environment Variables**:
   - Add **`DATABASE_URL`** = that string (ensure it starts with `postgresql://` or `postgres://`).
   - If Neon only injected a different name (e.g. `POSTGRES_URL`), either rename it to **`DATABASE_URL`** in Vercel or add **`DATABASE_URL`** as a duplicate pointing at the same value—this repo only reads **`DATABASE_URL`**.
6. **Save**, then trigger a **redeploy** so builds and functions see the new value.

**Migrations on Vercel:** your `vercel.json` **build** runs `node dist/db/migrate.js`, which needs **`DATABASE_URL` during the build**. In Vercel, ensure `DATABASE_URL` is available for **Production** (and **Preview** if builds run there).

---

#### B) Redis with **Upstash** (common with Vercel)

1. Go to [https://upstash.com](https://upstash.com) and sign in.
2. **Create database** → pick a **region** close to your Vercel region (e.g. `iad` if you deploy on `iad1`).
3. In the Upstash console open your database → **Connect** → open the **TCP** tab (not **REST**). `UPSTASH_REDIS_REST_*` is for HTTP clients only; this API needs the **Redis/TCP** URI with host like `*.upstash.io` and password.
4. Copy the URI (or build it from the `redis-cli --tls -u …` example). Upstash uses **TLS**; prefer **`rediss://default:TOKEN@endpoint:6379`**. If the UI shows **`redis://`** with TLS only implied by `--tls`, either switch the scheme to **`rediss://`** in your env, or keep **`redis://`** — the server **auto-upgrades** `redis://` → **`rediss://`** when the host ends with **`.upstash.io`**.
5. In **Vercel** (or local **`.env`**), set **`REDIS_URL`** to that full string.
6. **Save** and **redeploy** (or restart `pnpm dev` locally).

If you installed the **Upstash Vercel integration**, it may add **`UPSTASH_REDIS_REST_URL`** / **`UPSTASH_REDIS_REST_TOKEN`** for HTTP clients. **This codebase does not use those**; you still must set **`REDIS_URL`** to Upstash’s **TCP** URL for `ioredis`.

---

#### C) Alternatives (same rules)

- **Postgres:** [Supabase](https://supabase.com) (Database settings → URI), [Railway](https://railway.app) Postgres, [PlanetScale Postgres](https://planetscale.com), or **Render Postgres “External” URL**—anything that gives a **publicly reachable** `postgresql://…` string works from Vercel.
- **Redis:** [Redis Cloud](https://redis.io/cloud/), another vendor’s **TLS** `rediss://` URL, or any Redis reachable from the internet with auth—must end up as **`REDIS_URL`**.

---

#### D) What does **not** work from Vercel

- **Render “Internal”** Postgres or Key Value URLs: those hostnames only resolve on Render’s **private** network. A Vercel function runs elsewhere, so **`DATABASE_URL` / `REDIS_URL` must be reachable from the public internet** (or from Vercel’s egress), not “internal only” Render strings.

**Simpler architecture:** keep **Postgres + Redis + this API on Render** (or any VM), put **only the frontend** on Vercel, and point the browser at your Render API URL—then you *can* use Render internal URLs on the API service.

### Limits (important)

- **Request body size:** Vercel serverless payloads are capped (roughly **~4.5 MB** on Hobby; higher tiers allow more). **`POST /v1/users/me/photos`** allows up to **20 MB** by default—large uploads can fail on Vercel. Prefer **S3 direct uploads** (presigned URLs) or host the API on **Render** / a VM for full-size multipart uploads.
- **WebSockets / long-lived connections** are not a fit for this serverless wrapper.
- **Cold starts:** first request after idle pays DB + Redis connect cost (mitigated by warm instances on paid plans).

### Files

| File | Role |
| ---- | ---- |
| `vercel.json` | pnpm install/build + migrate, rewrites to `api`, function `maxDuration`. |
| `api/index.ts` | Serverless handler; bootstraps Express once per isolate (`src/serverless/bootstrap.ts`). |

## Scripts

| Script        | Purpose                          |
| ------------- | -------------------------------- |
| `pnpm dev` | TS dev server with reload        |
| `pnpm build` | Compile to `dist/`            |
| `pnpm start`   | Run compiled `dist/server.js`  |
| `pnpm start:prod` | Run migrations then server (native Node / non-Docker hosts) |
| `pnpm db:migrate` | Apply Drizzle SQL migrations |
| `pnpm db:generate` | Generate SQL from `src/db/schema.ts` |
| `pnpm db:studio` | Drizzle Studio (needs `DATABASE_URL`) |
| `pnpm lint` | ESLint                          |
| `pnpm test`   | Vitest (unit + integration)     |

## API (v1)

Base path: `/v1`

| Method | Path | Auth |
| ------ | ---- | ---- |
| `POST` | `/v1/auth/phone/send-otp` | no |
| `POST` | `/v1/auth/phone/verify-otp` | no |
| `POST` | `/v1/auth/google` | no |
| `POST` | `/v1/auth/refresh` | no |
| `POST` | `/v1/auth/logout` | no |
| `GET` | `/v1/auth/me` | Bearer access JWT |
| `GET` | `/v1/users/me/profile` | Bearer access JWT; JSON `{ interests, photos, preferences }` (`interests` = interest catalog id strings) |
| `PATCH` | `/v1/users/me/profile` | Bearer access JWT; **partial** JSON: at least one of `interests` (string id array, max 20) and/or `preferences` (full match-preferences object). Omitted fields are left unchanged. `200` returns full profile as GET. |
| `POST` | `/v1/users/me/photos` | Bearer access JWT; `multipart/form-data` field `file` (JPEG/PNG/WebP) |
| `DELETE` | `/v1/users/me/photos/:photoId` | Bearer access JWT; must own the photo |
| `GET` | `/v1/media/user-photos/:userId/:filename` | Public read when this API serves media: `local` or `postgres` (URL prefix from `PUBLIC_MEDIA_BASE_URL`) |

OpenAPI for Swagger UI is served from `src/http/openapiSpec.ts` (documentation only); request validation uses **Zod** in route handlers.

### Profile photos (media)

- **`GET /v1/auth/me`** includes an ordered **`photos`** array: `{ id, url, alt?, blurDataUrl? }[]` (empty when none). **`POST /v1/users/me/photos`** returns the same shape for the new row (`201`).
- **`GET /v1/users/me/profile`** returns top-level **`interests`** (catalog id strings, empty `[]` when none; order preserved) plus **`photos`** and **`preferences`** (`seeking`, `ageRange` 18–99, **`ageRangeStrict`**, `distanceKm`, `intentions`). Match defaults when no `user_match_preferences` row: empty **`seeking`**, **`ageRange` 18–99**, **`ageRangeStrict` false**, **`distanceKm` 50**, **empty `intentions`**.
- **Storage**: set **`USER_PHOTOS_STORAGE`** to `local` (default), **`postgres`** (BLOBs in `user_photos.object_data` — same `url` and `/v1/media/...` paths as local), or `s3`. Local writes under **`USER_PHOTOS_LOCAL_DIR`**. S3 needs **`S3_*`** (see env schema). To move back to S3 later, switch **`USER_PHOTOS_STORAGE`**, re-upload (or run a one-off copy from DB to bucket), and point **`PUBLIC_MEDIA_BASE_URL`** at the CDN; JSON shape from the API stays the same.
- **URLs**: **`PUBLIC_MEDIA_BASE_URL`** must be a stable base with **no trailing slash**; `storageKey` values are appended (`…/v1/media` + `/user-photos/…` for **local** and **postgres** when the API serves bytes).
- **Limits**: **`USER_PHOTOS_MAX_BYTES`** (default 20 MiB), **`USER_PHOTOS_MAX_PER_USER`** (default 8). Uploads are also covered by **`RATE_LIMIT_UPLOAD_MAX`** / **`RATE_LIMIT_UPLOAD_WINDOW_MS`** (Redis-backed, same pattern as auth rate limits).
- **CORS**: `CORS_ORIGINS` defaults to `http://localhost:5173` so the Vite dev app can send `Authorization` on multipart `POST` (browser preflight is supported by `cors` with explicit origins).

## Auth model (this phase)

### Phone OTP

- OTP codes are generated server-side, **HMAC-SHA256** stored in Redis with a server pepper (`OTP_PEPPER`), and verified with constant-time comparison.
- Send and verify attempts are **rate-limited in Redis** (cooldown, per-window send caps, verify lockouts).
- SMS delivery is behind an **`SmsProvider` interface**; development uses a **stub** that logs the OTP via structured logging (`sms: stub_send_otp`). In development, `POST /v1/auth/phone/send-otp` also returns `devOtp` for convenience.

### Google (native-friendly)

- Clients use the **Google Sign-In SDK** (iOS / Android / Web) to obtain a **Google ID token** for your OAuth client IDs.
- The backend verifies that JWT with `google-auth-library` (`verifyIdToken`) against the comma-separated `GOOGLE_CLIENT_IDS` (include Web, iOS, and Android client IDs as needed).
- This avoids handling authorization `code` + PKCE server-side for native apps while still keeping verification on the server. For pure server-driven OAuth code flows, extend `POST /v1/auth/google` later.

### JWT + refresh rotation

- **Access token**: HS256 JWT (`JWT_ACCESS_SECRET`), ~15 minutes (`ACCESS_TOKEN_TTL_SECONDS`), claim `typ: "access"`.
- **Refresh token**: opaque random string; **SHA-256 lookup hash** for indexed lookup plus **Argon2id** hash for verification at the database layer.
- **Rotation**: `POST /v1/auth/refresh` revokes the previous row and inserts a new refresh token, linking `replaced_by_token_id`.
- **Logout**: `POST /v1/auth/logout` revokes the presented refresh token if it matches.

Important auth transitions are written to `auth_audit_logs`.

## Architecture decisions

### Drizzle instead of Prisma

- **Drizzle** keeps SQL and migrations close to Postgres, has a tiny runtime, and fits a **pool-based** `pg` deployment without a heavy query engine.
- It makes **explicit queries** and indexing strategy obvious, which helps avoid accidental N+1 patterns as features grow.
- Prisma remains a strong choice for rapid CRUD-centric apps; here we bias toward **latency and operational simplicity** on a stateless API tier.

### Redis usage

- OTP state, send/verify counters, and short-lived locks live in Redis so API replicas stay stateless.
- **`express-rate-limit`** with **`rate-limit-redis`** backs a **global** limiter and **auth-route** limiters so counts are shared across instances.

### TypeScript strictness

- `strict` and `noUncheckedIndexedAccess` are enabled. `exactOptionalPropertyTypes` is **disabled** to reduce friction with ecosystem typings (Express, Zod, Drizzle) while keeping the rest of strict mode.

### Structured logging

- **Pino** is the application logger (`pino-http` attaches `req.log`); in development `pino-pretty` is enabled via transport options on the root logger instance.

## Security notes

- **Security headers** (CSP, CORP, etc.) are not set in-app; configure them at your edge (CDN / reverse proxy) if you need them.
- **CORS** uses an explicit allowlist (`CORS_ORIGINS`). Mobile clients may omit `Origin`; those requests are allowed when `Origin` is absent.
- **`REQUIRE_HTTPS`**: when `true` in production, requests must present `X-Forwarded-Proto: https` (set **`TRUST_PROXY=true`** and **`TRUST_PROXY_HOPS`** as needed behind TLS-terminating proxies).
- Refresh tokens are **never logged** (redaction paths on `refreshToken` / `idToken` in logs).

## Tests

```bash
pnpm test
```

Unit tests always run. Integration tests are **skipped by default** (no Docker required in CI).

With Postgres + Redis from `docker compose up -d postgres redis`:

```bash
pnpm db:migrate
pnpm test:integration
```

Or run everything (unit + integration) in one shot:

```bash
DATABASE_INTEGRATION=1 pnpm test
```

Defaults for `DATABASE_URL` / `REDIS_URL` are in `test/setupEnv.ts`.

## Layout

```
env.prod.example     # prod env template (copy to gitignored env.prod)
src/
  app.ts              # Express factory (middleware, routers, errors)
  server.ts           # HTTP server + listen + graceful shutdown
  config/             # env parsing (zod)
  db/                 # drizzle client, schema, migrate CLI
  http/               # OpenAPI spec for /docs (transport-only)
  redis/              # ioredis client
  lib/                # errors, http helpers, validation helpers
  modules/auth/       # auth domain (OTP, Google, tokens, SMS)
  modules/media/      # profile photo object storage (local, Postgres BLOB, S3)
  modules/userPhotos/ # profile photo rows + API mapping
  api/                # Vercel serverless entry (`api/index.ts`)
  routes/             # Express routers (thin)
  vercel.json         # Vercel install/build/rewrites (optional host)
```
