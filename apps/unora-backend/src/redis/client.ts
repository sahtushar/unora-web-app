import {Redis} from "ioredis";

import type {Env} from "../config/env.js";
import type {Logger} from "../lib/logger.js";

/**
 * Upstash requires TLS. The console often shows `redis-cli --tls -u redis://...` (TLS via flag),
 * but ioredis treats `redis://` as plaintext unless the scheme is `rediss://` or `tls` is set.
 */
function redisConnectionUrlForIoredis(url: string): string {
  if (url.startsWith("redis://") && url.includes(".upstash.io")) {
    return `rediss://${url.slice("redis://".length)}`;
  }
  return url;
}

export function createRedis(env: Env, log: Logger) {
  let lastErrorLogMs = 0;
  const errorLogThrottleMs = 15_000;

  const redisUrl = redisConnectionUrlForIoredis(env.REDIS_URL);

  const redis = new Redis(redisUrl, {
    connectTimeout: 10_000,
    enableReadyCheck: true,
    lazyConnect: true,
    maxRetriesPerRequest: 2,
    retryStrategy(times) {
      const delay = Math.min(times * 400, 10_000);
      return delay;
    },
  });

  redis.on("error", (error: Error) => {
    const code =
      "code" in error ? (error as NodeJS.ErrnoException).code : undefined;
    const now = Date.now();
    if (code === "ECONNREFUSED" && now - lastErrorLogMs < errorLogThrottleMs) {
      return;
    }
    lastErrorLogMs = now;
    log.error({err: error}, "redis_error");
  });

  return redis;
}

export type RedisClient = ReturnType<typeof createRedis>;
