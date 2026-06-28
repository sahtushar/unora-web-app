import {drizzle} from "drizzle-orm/node-postgres";
import {migrate} from "drizzle-orm/node-postgres/migrator";
import path from "node:path";
import {fileURLToPath} from "node:url";
import pg from "pg";

import {loadEnv} from "../config/env.js";
import {loadDotenvFiles} from "../config/loadDotenv.js";

async function main() {
  loadDotenvFiles();
  const env = loadEnv(process.env);
  const pool = new pg.Pool({connectionString: env.DATABASE_URL});
  const db = drizzle(pool);

  const here = path.dirname(fileURLToPath(import.meta.url));
  const migrationsFolder = path.join(here, "..", "..", "drizzle");

  await migrate(db, {migrationsFolder});
  await pool.end();
}

void main().catch((error) => {
  console.error(error);
  process.exit(1);
});
