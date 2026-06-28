export type OtpSendBlockReason = "cooldown" | "window" | "locked";

export function evaluateOtpSendLimits(params: {
  inCooldown: boolean;
  isLocked: boolean;
  sendsInWindow: number;
  windowMax: number;
}): {allowed: true} | {allowed: false; reason: OtpSendBlockReason} {
  if (params.isLocked) {
    return {allowed: false, reason: "locked"};
  }
  if (params.inCooldown) {
    return {allowed: false, reason: "cooldown"};
  }
  if (params.sendsInWindow >= params.windowMax) {
    return {allowed: false, reason: "window"};
  }
  return {allowed: true};
}

export function evaluateOtpVerifyLock(params: {
  attempts: number;
  maxAttempts: number;
}): {locked: boolean} {
  return {locked: params.attempts >= params.maxAttempts};
}
