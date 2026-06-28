import type {EnabledValidations} from "express-rate-limit";

/**
 * express-rate-limit v8 validates proxy headers against Express `trust proxy`. On Vercel (and
 * similar), `Forwarded` / `X-Forwarded-For` plus the serverless request shape can still trip
 * ERR_ERL_* checks even with a numeric hop count. We configure `trust proxy` in `buildApp`;
 * disabling these three checks is the supported mitigation (see express-rate-limit error codes).
 */
export const rateLimitValidateSkipProxyGuards: EnabledValidations = {
  forwardedHeader: false,
  trustProxy: false,
  xForwardedForHeader: false,
};
