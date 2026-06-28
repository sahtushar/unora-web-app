FROM node:20-bookworm-slim AS build

RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY tsconfig.json tsconfig.build.json drizzle.config.ts ./
COPY drizzle ./drizzle
COPY src ./src

RUN pnpm run build

FROM node:20-bookworm-slim AS runner

RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

WORKDIR /app
ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY --from=build /app/dist ./dist
COPY --from=build /app/drizzle ./drizzle

EXPOSE 8000

CMD ["sh", "-c", "node dist/db/migrate.js && node dist/server.js"]
