import {Router} from "express";
import {rateLimit} from "express-rate-limit";
import {RedisStore} from "rate-limit-redis";
import {z} from "zod";

import {AppError} from "../../lib/errors.js";
import {assertHttpsInProduction, getClientIp} from "../../lib/http.js";
import {rateLimitValidateSkipProxyGuards} from "../../lib/rateLimitBehindProxy.js";
import {createRedisSendCommand} from "../../lib/redisSendCommand.js";
import {parseBody} from "../../lib/validate.js";
import type {AuthDeps} from "../../modules/auth/auth.service.js";
import {
  getMe,
  loginWithGoogle,
  logout,
  refreshSession,
  sendPhoneOtp,
  verifyPhoneOtp,
} from "../../modules/auth/auth.service.js";
import type {RedisClient} from "../../redis/client.js";
import {requireAccessJwt} from "./requireAccessJwt.js";

const phoneE164 = z
  .string()
  .regex(/^\+[1-9]\d{1,14}$/, "Must be E.164 (+countrycode...)");

function createAuthRateLimit(auth: AuthDeps, redis: RedisClient) {
  return rateLimit({
    legacyHeaders: false,
    max: auth.env.RATE_LIMIT_AUTH_MAX,
    passOnStoreError: true,
    standardHeaders: true,
    validate: rateLimitValidateSkipProxyGuards,
    store: new RedisStore({
      prefix: "unora:rl:auth:",
      sendCommand: createRedisSendCommand(redis),
    }),
    windowMs: auth.env.RATE_LIMIT_AUTH_WINDOW_MS,
  });
}

export function createAuthRouter(auth: AuthDeps, redis: RedisClient): Router {
  const router = Router();
  const authLimiter = createAuthRateLimit(auth, redis);

  router.use((req, _res, next) => {
    try {
      assertHttpsInProduction(auth.env, req);
      next();
    } catch (err) {
      next(err);
    }
  });

  router.post("/phone/send-otp", authLimiter, async (req, res) => {
    const body = parseBody(z.object({phoneE164}), req.body);
    const result = await sendPhoneOtp(auth, {
      ip: getClientIp(req),
      phoneE164: body.phoneE164,
      userAgent: req.headers["user-agent"],
    });
    res.json({ok: true as const, ...result});
  });

  router.post("/phone/verify-otp", authLimiter, async (req, res) => {
    const body = parseBody(
      z.object({
        code: z.string().min(4).max(12),
        phoneE164,
      }),
      req.body
    );
    const out = await verifyPhoneOtp(auth, {
      code: body.code,
      ip: getClientIp(req),
      phoneE164: body.phoneE164,
      userAgent: req.headers["user-agent"],
    });
    res.json(out);
  });

  router.post("/google", authLimiter, async (req, res) => {
    const body = parseBody(z.object({idToken: z.string().min(10)}), req.body);
    const out = await loginWithGoogle(auth, {
      idToken: body.idToken,
      ip: getClientIp(req),
      userAgent: req.headers["user-agent"],
    });
    res.json(out);
  });

  router.post("/refresh", authLimiter, async (req, res) => {
    const body = parseBody(
      z.object({refreshToken: z.string().min(10)}),
      req.body
    );
    const out = await refreshSession(auth, {
      ip: getClientIp(req),
      refreshToken: body.refreshToken,
      userAgent: req.headers["user-agent"],
    });
    res.json(out);
  });

  router.post("/logout", authLimiter, async (req, res) => {
    const body = parseBody(
      z.object({refreshToken: z.string().min(10)}),
      req.body
    );
    await logout(auth, {
      ip: getClientIp(req),
      refreshToken: body.refreshToken,
      userAgent: req.headers["user-agent"],
    });
    res.json({ok: true as const});
  });

  router.get("/me", requireAccessJwt(auth), async (req, res) => {
    const userId = req.authUser?.id;
    if (userId === undefined) {
      throw new AppError("UNAUTHORIZED", "Missing bearer token");
    }

    const user = await getMe(auth, userId);
    res.json({
      ...user,
      createdAt: user.createdAt.toISOString(),
      lastLoginAt: user.lastLoginAt ? user.lastLoginAt.toISOString() : null,
      updatedAt: user.updatedAt.toISOString(),
    });
  });

  return router;
}
