/**
 * Express application factory. Swap this file (and `src/routes/**` wiring) to move to another HTTP
 * framework; keep `src/modules/**`, `src/db/**`, and `src/config/**` unchanged.
 */
import cors from "cors";
import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import {rateLimit} from "express-rate-limit";
import {pinoHttp} from "pino-http";
import {RedisStore} from "rate-limit-redis";
import swaggerUi from "swagger-ui-express";

import type {Env} from "./config/env.js";
import type {Db} from "./db/client.js";
import {openApiDocument} from "./http/openapiSpec.js";
import {isAppError} from "./lib/errors.js";
import type {Logger} from "./lib/logger.js";
import {rateLimitValidateSkipProxyGuards} from "./lib/rateLimitBehindProxy.js";
import {createRedisSendCommand} from "./lib/redisSendCommand.js";
import type {AuthDeps} from "./modules/auth/auth.service.js";
import {RedisOtpRepository} from "./modules/auth/otp/redisOtpRepository.js";
import {createSmsProvider} from "./modules/auth/sms/factory.js";
import {createUserPhotoObjectStorage} from "./modules/media/userPhotoObjectStorage.js";
import type {RedisClient} from "./redis/client.js";
import healthRoutes from "./routes/health.js";
import {createV1Router} from "./routes/v1/index.js";

export type BuildAppParams = {
  db: Db;
  env: Env;
  log: Logger;
  redis: RedisClient;
};

export function buildApp(params: BuildAppParams): Express {
  const app = express();
  app.disable("x-powered-by");
  app.set(
    "trust proxy",
    params.env.TRUST_PROXY ? params.env.TRUST_PROXY_HOPS : false
  );

  app.use(pinoHttp({logger: params.log}));

  app.use(
    cors({
      credentials: true,
      origin(origin, callback) {
        if (origin === undefined || origin.length === 0) {
          callback(null, true);
          return;
        }
        if (params.env.CORS_ORIGINS.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(null, false);
      },
    })
  );

  const globalLimiter = rateLimit({
    legacyHeaders: false,
    max: params.env.RATE_LIMIT_GLOBAL_MAX,
    passOnStoreError: true,
    standardHeaders: true,
    validate: rateLimitValidateSkipProxyGuards,
    store: new RedisStore({
      prefix: "unora:rl:",
      sendCommand: createRedisSendCommand(params.redis),
    }),
    windowMs: params.env.RATE_LIMIT_GLOBAL_WINDOW_MS,
  });
  app.use(globalLimiter);

  app.use(express.json());

  if (params.env.ENABLE_OPENAPI_UI) {
    app.use(
      "/docs",
      swaggerUi.serve,
      swaggerUi.setup(openApiDocument as Record<string, unknown>)
    );
  }

  const auth: AuthDeps = {
    db: params.db,
    env: params.env,
    log: params.log,
    otpRepo: new RedisOtpRepository(params.redis, params.env),
    sms: createSmsProvider(params.env, params.log),
  };

  const userPhotoStorage = createUserPhotoObjectStorage(params.env);

  app.use(healthRoutes);
  app.use(
    "/v1",
    createV1Router({
      auth,
      env: params.env,
      redis: params.redis,
      userPhotoStorage,
    })
  );

  app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      next(err);
      return;
    }

    if (err instanceof SyntaxError) {
      res.status(400).json({
        error: {code: "BAD_REQUEST", message: "Invalid JSON"},
      });
      return;
    }

    if (isAppError(err)) {
      res.status(err.statusCode).json({
        error: {
          code: err.code,
          details: err.details,
          message: err.message,
        },
      });
      return;
    }

    const reqLog = req.log ?? params.log;
    reqLog.error({err}, "unhandled_error");
    res.status(500).json({
      error: {code: "INTERNAL", message: "Internal server error"},
    });
  });

  return app;
}
