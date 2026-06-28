import {describe, expect, it} from "vitest";

import {
  evaluateOtpSendLimits,
  evaluateOtpVerifyLock,
} from "../src/modules/auth/otp/limits.js";

describe("evaluateOtpSendLimits", () => {
  it("blocks when locked", () => {
    expect(
      evaluateOtpSendLimits({
        inCooldown: false,
        isLocked: true,
        sendsInWindow: 0,
        windowMax: 3,
      }),
    ).toEqual({allowed: false, reason: "locked"});
  });

  it("blocks when in cooldown", () => {
    expect(
      evaluateOtpSendLimits({
        inCooldown: true,
        isLocked: false,
        sendsInWindow: 0,
        windowMax: 3,
      }),
    ).toEqual({allowed: false, reason: "cooldown"});
  });

  it("blocks when window exhausted", () => {
    expect(
      evaluateOtpSendLimits({
        inCooldown: false,
        isLocked: false,
        sendsInWindow: 3,
        windowMax: 3,
      }),
    ).toEqual({allowed: false, reason: "window"});
  });

  it("allows when under limits", () => {
    expect(
      evaluateOtpSendLimits({
        inCooldown: false,
        isLocked: false,
        sendsInWindow: 2,
        windowMax: 3,
      }),
    ).toEqual({allowed: true});
  });
});

describe("evaluateOtpVerifyLock", () => {
  it("locks when attempts reach max", () => {
    expect(evaluateOtpVerifyLock({attempts: 5, maxAttempts: 5})).toEqual({
      locked: true,
    });
  });

  it("does not lock before max", () => {
    expect(evaluateOtpVerifyLock({attempts: 4, maxAttempts: 5})).toEqual({
      locked: false,
    });
  });
});
