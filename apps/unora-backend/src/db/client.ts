import {drizzle} from "drizzle-orm/node-postgres";
import pg from "pg";

import type {Env} from "../config/env.js";
import type {Logger} from "../lib/logger.js";
import * as schema from "./schema.js";

export function createDb(env: Env, log: Logger) {
  const pool = new pg.Pool({
    connectionString: env.DATABASE_URL,
    connectionTimeoutMillis: 10_000,
    idleTimeoutMillis: 30_000,
    max: 20,
  });

  pool.on("error", (error) => {
    log.error({err: error}, "pg_pool_error");
  });

  const db = drizzle(pool, {schema});

  return {
    close: async () => {
      await pool.end();
    },
    db,
    pool,
  };
}

export type DbClient = ReturnType<typeof createDb>;
export type Db = DbClient["db"];
