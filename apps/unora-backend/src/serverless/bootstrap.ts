import type {Express} from "express";

import {buildApp} from "../app.js";
import {loadEnv} from "../config/env.js";
import {loadDotenvFiles} from "../config/loadDotenv.js";
import {createDb} from "../db/client.js";
import {createLogger} from "../lib/logger.js";
import {createRedis} from "../redis/client.js";

let cachedApp: Express | undefined;
let initPromise: Promise<Express> | undefined;

/**
 * Lazily builds the Express app for serverless (e.g. Vercel). Reuses one instance per warm isolate.
 */
export async function getServerlessApp(): Promise<Express> {
  if (cachedApp !== undefined) {
    return cachedApp;
  }
  initPromise ??= (async () => {
    loadDotenvFiles();
    const env = loadEnv(process.env);
    const log = createLogger(env);
    const database = createDb(env, log);
    const redis = createRedis(env, log);
    await redis.connect();
    await redis.ping();
    const app = buildApp({db: database.db, env, log, redis});
    cachedApp = app;
    return app;
  })();
  try {
    return await initPromise;
  } catch (error) {
    initPromise = undefined;
    cachedApp = undefined;
    throw error;
  }
}
