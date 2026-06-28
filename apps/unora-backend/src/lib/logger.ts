import * as PinoPkg from "pino";

import type {Env} from "../config/env.js";

// CJS `export =`: resolve callable under Node ESM without a typed `default` on the namespace.
const pino = (Reflect.get(PinoPkg as object, "default") ??
  PinoPkg) as typeof import("pino");

export function createLogger(env: Env) {
  return pino({
    level: env.LOG_LEVEL,
    ...(env.NODE_ENV === "development"
      ? {
          transport: {
            target: "pino-pretty",
            options: {
              colorize: true,
              translateTime: "SYS:standard",
              ignore: "pid,hostname",
            },
          },
        }
      : {}),
    redact: {
      paths: ["req.headers.authorization", "body.refreshToken", "body.idToken"],
      remove: true,
    },
  });
}

export type Logger = ReturnType<typeof createLogger>;
