import {existsSync} from "node:fs";
import {resolve} from "node:path";

import {config} from "dotenv";
import {defineConfig} from "drizzle-kit";

const root = process.cwd();
const envPath = resolve(root, ".env");
if (existsSync(envPath)) {
  config({override: false, path: envPath});
}
const localPath = resolve(root, ".env.local");
if (existsSync(localPath)) {
  config({override: true, path: localPath});
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://unora:unora@127.0.0.1:5433/unora",
  },
});
