import {createHmac, randomInt, timingSafeEqual} from "node:crypto";

import type {Env} from "../../../config/env.js";
import type {RedisClient} from "../../../redis/client.js";
import {evaluateOtpSendLimits, evaluateOtpVerifyLock} from "./limits.js";

const cooldownKey = (e164: string) => `otp:cooldown:${e164}`;
const lockKey = (e164: string) => `otp:lock:${e164}`;
const sendCountKey = (e164: string) => `otp:send_count:${e164}`;
const codeKey = (e164: string) => `otp:code:${e164}`;
const verifyAttemptsKey = (e164: string) => `otp:verify_attempts:${e164}`;

function hashOtp(env: Env, e164: string, code: string): string {
  return createHmac("sha256", env.OTP_PEPPER)
    .update(`${e164}:${code}`)
    .digest("hex");
}

function generateNumericOtp(length: number): string {
  const max = 10 ** length;
  const n = randomInt(0, max);
  return n.toString().padStart(length, "0");
}

export class RedisOtpRepository {
  constructor(
    private readonly redis: RedisClient,
    private readonly env: Env
  ) {}

  async getSendState(e164: string): Promise<{
    inCooldown: boolean;
    isLocked: boolean;
    sendsInWindow: number;
    windowTtlSeconds: number;
  }> {
    const pipeline = this.redis.pipeline();
    pipeline.get(sendCountKey(e164));
    pipeline.ttl(sendCountKey(e164));
    pipeline.ttl(cooldownKey(e164));
    pipeline.ttl(lockKey(e164));
    const results = await pipeline.exec();
    const countRaw = results?.[0]?.[1] as string | null;
    const windowTtl = Number(results?.[1]?.[1] ?? -1);
    const cooldownTtl = Number(results?.[2]?.[1] ?? -1);
    const lockTtl = Number(results?.[3]?.[1] ?? -1);

    return {
      inCooldown: cooldownTtl > 0,
      isLocked: lockTtl > 0,
      sendsInWindow:
        countRaw !== null && countRaw !== undefined && countRaw !== ""
          ? Number(countRaw)
          : 0,
      windowTtlSeconds: windowTtl > 0 ? windowTtl : 0,
    };
  }

  async assertCanSend(e164: string): Promise<void> {
    const state = await this.getSendState(e164);
    const decision = evaluateOtpSendLimits({
      inCooldown: state.inCooldown,
      isLocked: state.isLocked,
      sendsInWindow: state.sendsInWindow,
      windowMax: this.env.OTP_SEND_MAX_PER_WINDOW,
    });
    if (!decision.allowed) {
      const err = new Error(decision.reason);
      err.name = "OtpSendBlocked";
      throw err;
    }
  }

  async createAndStoreOtp(e164: string): Promise<string> {
    const code = generateNumericOtp(this.env.OTP_LENGTH);
    const digest = hashOtp(this.env, e164, code);

    const sends = await this.redis.incr(sendCountKey(e164));
    if (sends === 1) {
      await this.redis.expire(
        sendCountKey(e164),
        this.env.OTP_SEND_WINDOW_SECONDS
      );
    }
    if (sends > this.env.OTP_SEND_MAX_PER_WINDOW) {
      await this.redis.decr(sendCountKey(e164));
      const err = new Error("window");
      err.name = "OtpSendBlocked";
      throw err;
    }

    await this.redis.set(
      cooldownKey(e164),
      "1",
      "EX",
      this.env.OTP_SEND_COOLDOWN_SECONDS
    );
    await this.redis.set(codeKey(e164), digest, "EX", this.env.OTP_TTL_SECONDS);

    return code;
  }

  async verifyOtp(e164: string, code: string): Promise<boolean> {
    const lockTtl = await this.redis.ttl(lockKey(e164));
    if (lockTtl > 0) {
      return false;
    }

    const expected = await this.redis.get(codeKey(e164));
    if (expected === null || expected === undefined || expected.length === 0) {
      return false;
    }

    const actual = hashOtp(this.env, e164, code);
    const expectedBuf = Buffer.from(expected, "utf8");
    const actualBuf = Buffer.from(actual, "utf8");
    if (expectedBuf.length !== actualBuf.length) {
      return false;
    }
    const ok = timingSafeEqual(expectedBuf, actualBuf);
    if (ok) {
      await this.redis.del(
        codeKey(e164),
        verifyAttemptsKey(e164),
        sendCountKey(e164),
        cooldownKey(e164)
      );
      return true;
    }

    const attempts = await this.redis.incr(verifyAttemptsKey(e164));
    if (attempts === 1) {
      await this.redis.expire(
        verifyAttemptsKey(e164),
        this.env.OTP_TTL_SECONDS
      );
    }

    const lockDecision = evaluateOtpVerifyLock({
      attempts,
      maxAttempts: this.env.OTP_VERIFY_MAX_ATTEMPTS,
    });
    if (lockDecision.locked) {
      await this.redis.set(
        lockKey(e164),
        "1",
        "EX",
        this.env.OTP_VERIFY_LOCK_SECONDS
      );
    }

    return false;
  }
}
