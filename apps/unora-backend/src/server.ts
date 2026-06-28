import http from "node:http";

import {buildApp} from "./app.js";
import {loadEnv} from "./config/env.js";
import {loadDotenvFiles} from "./config/loadDotenv.js";
import {createDb} from "./db/client.js";
import {createLogger} from "./lib/logger.js";
import {createRedis} from "./redis/client.js";

async function main() {
  loadDotenvFiles();
  const env = loadEnv(process.env);
  const log = createLogger(env);
  const database = createDb(env, log);
  const redis = createRedis(env, log);
  try {
    await redis.connect();
    await redis.ping();
  } catch (error) {
    log.fatal(
      {err: error},
      "redis_unreachable_start_redis_e_g_docker_compose_up_d_redis_and_check_REDIS_URL"
    );
    await database.close().catch(() => {});
    process.exit(1);
  }

  const app = buildApp({db: database.db, env, log, redis});
  const server = http.createServer(app);

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen({host: env.HOST, port: env.PORT}, () => {
      server.removeListener("error", reject);
      resolve();
    });
  });

  log.info({host: env.HOST, port: env.PORT}, "server_listening");

  const shutdown = async (signal: string) => {
    log.info({signal}, "shutdown_started");
    try {
      await new Promise<void>((resolve, reject) => {
        server.close((err) => {
          if (err !== undefined && err !== null) {
            reject(err);
            return;
          }
          resolve();
        });
      });
    } finally {
      await redis.quit();
      await database.close();
    }
    log.info({}, "shutdown_complete");
    process.exit(0);
  };

  process.on("SIGINT", () => {
    void shutdown("SIGINT");
  });
  process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
  });
}

void main().catch((error) => {
  console.error(error);
  process.exit(1);
});
