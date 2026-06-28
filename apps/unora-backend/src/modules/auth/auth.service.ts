import {eq} from "drizzle-orm";

import type {Env} from "../../config/env.js";
import type {Db} from "../../db/client.js";
import {users} from "../../db/schema.js";
import {AppError} from "../../lib/errors.js";
import type {Logger} from "../../lib/logger.js";
import {listUserPhotosJson} from "../userPhotos/userPhoto.service.js";
import {insertAuthAuditLog} from "./audit.js";
import {verifyGoogleIdToken} from "./google/verifyGoogleIdToken.js";
import {RedisOtpRepository} from "./otp/redisOtpRepository.js";
import type {SmsProvider} from "./sms/types.js";
import {signAccessJwt} from "./tokens/accessJwt.js";
import {
  hashRefreshToken,
  insertRefreshTokenRow,
  mintRefreshToken,
  revokeRefreshTokenByRaw,
  rotateRefreshToken,
} from "./tokens/refreshToken.js";

export type AuthDeps = {
  db: Db;
  env: Env;
  log: Logger;
  otpRepo: RedisOtpRepository;
  sms: SmsProvider;
};

function mapOtpSendBlocked(error: unknown): AppError {
  if (error instanceof Error && error.name === "OtpSendBlocked") {
    if (error.message === "locked") {
      return new AppError(
        "FORBIDDEN",
        "OTP verification is temporarily locked"
      );
    }
    return new AppError(
      "RATE_LIMITED",
      "Too many OTP requests for this number",
      {statusCode: 429}
    );
  }
  if (error instanceof AppError) {
    return error;
  }
  if (error instanceof Error) {
    return new AppError("INTERNAL", error.message);
  }
  return new AppError("INTERNAL", "Unexpected OTP error");
}

export async function sendPhoneOtp(
  deps: AuthDeps,
  params: {phoneE164: string; ip?: string; userAgent?: string}
): Promise<{devOtp?: string}> {
  try {
    await deps.otpRepo.assertCanSend(params.phoneE164);
  } catch (error) {
    await insertAuthAuditLog(deps.db, {
      eventType: "otp_send_blocked",
      ip: params.ip,
      meta: {phoneE164: params.phoneE164},
      userAgent: params.userAgent,
    });
    throw mapOtpSendBlocked(error);
  }

  let code: string;
  try {
    code = await deps.otpRepo.createAndStoreOtp(params.phoneE164);
  } catch (error) {
    await insertAuthAuditLog(deps.db, {
      eventType: "otp_send_blocked",
      ip: params.ip,
      meta: {phoneE164: params.phoneE164},
      userAgent: params.userAgent,
    });
    throw mapOtpSendBlocked(error);
  }

  const smsResult = await deps.sms.sendOtp({
    code,
    toE164: params.phoneE164,
  });
  if (!smsResult.ok) {
    deps.log.error({reason: smsResult.reason}, "sms_send_failed");
    throw new AppError("INTERNAL", "Failed to send SMS");
  }

  await insertAuthAuditLog(deps.db, {
    eventType: "otp_sent",
    ip: params.ip,
    meta: {phoneE164: params.phoneE164},
    userAgent: params.userAgent,
  });

  if (deps.env.NODE_ENV === "development" || deps.env.NODE_ENV === "test") {
    return {devOtp: code};
  }
  return {};
}

export async function verifyPhoneOtp(
  deps: AuthDeps,
  params: {
    code: string;
    phoneE164: string;
    ip?: string;
    userAgent?: string;
  }
): Promise<{accessToken: string; refreshToken: string; userId: string}> {
  const ok = await deps.otpRepo.verifyOtp(params.phoneE164, params.code);
  if (!ok) {
    throw new AppError("UNAUTHORIZED", "Invalid or expired OTP");
  }

  const [existing] = await deps.db
    .select()
    .from(users)
    .where(eq(users.phoneE164, params.phoneE164))
    .limit(1);

  let userId: string;
  if (existing) {
    userId = existing.id;
    await deps.db
      .update(users)
      .set({lastLoginAt: new Date(), updatedAt: new Date()})
      .where(eq(users.id, existing.id));
  } else {
    const [created] = await deps.db
      .insert(users)
      .values({
        lastLoginAt: new Date(),
        phoneE164: params.phoneE164,
        updatedAt: new Date(),
      })
      .returning({id: users.id});
    if (!created) {
      throw new AppError("INTERNAL", "Failed to create user");
    }
    userId = created.id;
  }

  const refresh = mintRefreshToken();
  const hashed = await hashRefreshToken(refresh.raw);
  await insertRefreshTokenRow(deps.db, {
    env: deps.env,
    hashedToken: hashed,
    ip: params.ip,
    lookupHash: refresh.lookupHash,
    userAgent: params.userAgent,
    userId,
  });

  const accessToken = await signAccessJwt(deps.env, userId);

  await insertAuthAuditLog(deps.db, {
    eventType: "otp_verified",
    ip: params.ip,
    userAgent: params.userAgent,
    userId,
  });

  return {accessToken, refreshToken: refresh.raw, userId};
}

export async function loginWithGoogle(
  deps: AuthDeps,
  params: {
    idToken: string;
    ip?: string;
    userAgent?: string;
  }
): Promise<{accessToken: string; refreshToken: string; userId: string}> {
  const identity = await verifyGoogleIdToken({
    audience: deps.env.GOOGLE_CLIENT_IDS,
    idToken: params.idToken,
  });

  if (!identity.emailVerified) {
    throw new AppError("FORBIDDEN", "Google email is not verified");
  }

  const [existing] = await deps.db
    .select()
    .from(users)
    .where(eq(users.googleSub, identity.sub))
    .limit(1);

  let userId: string;
  if (existing) {
    userId = existing.id;
    await deps.db
      .update(users)
      .set({
        email: identity.email ?? existing.email,
        lastLoginAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, existing.id));
  } else {
    const [created] = await deps.db
      .insert(users)
      .values({
        email: identity.email,
        googleSub: identity.sub,
        lastLoginAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({id: users.id});
    if (!created) {
      throw new AppError("INTERNAL", "Failed to create user");
    }
    userId = created.id;
  }

  const refresh = mintRefreshToken();
  const hashed = await hashRefreshToken(refresh.raw);
  await insertRefreshTokenRow(deps.db, {
    env: deps.env,
    hashedToken: hashed,
    ip: params.ip,
    lookupHash: refresh.lookupHash,
    userAgent: params.userAgent,
    userId,
  });

  const accessToken = await signAccessJwt(deps.env, userId);

  await insertAuthAuditLog(deps.db, {
    eventType: "google_login",
    ip: params.ip,
    userAgent: params.userAgent,
    userId,
  });

  return {accessToken, refreshToken: refresh.raw, userId};
}

export async function refreshSession(
  deps: AuthDeps,
  params: {refreshToken: string; ip?: string; userAgent?: string}
): Promise<{accessToken: string; refreshToken: string; userId: string}> {
  try {
    const rotated = await rotateRefreshToken(deps.db, {
      env: deps.env,
      ip: params.ip,
      raw: params.refreshToken,
      userAgent: params.userAgent,
    });

    await insertAuthAuditLog(deps.db, {
      eventType: "refresh_rotated",
      ip: params.ip,
      userAgent: params.userAgent,
      userId: rotated.userId,
    });

    return rotated;
  } catch (error) {
    if (error instanceof AppError && error.code === "UNAUTHORIZED") {
      await insertAuthAuditLog(deps.db, {
        eventType: "refresh_rejected",
        ip: params.ip,
        userAgent: params.userAgent,
      });
    }
    throw error;
  }
}

export async function logout(
  deps: AuthDeps,
  params: {refreshToken: string; ip?: string; userAgent?: string}
): Promise<void> {
  const revoked = await revokeRefreshTokenByRaw(deps.db, params.refreshToken);
  if (!revoked) {
    return;
  }

  await insertAuthAuditLog(deps.db, {
    eventType: "logout",
    ip: params.ip,
    userAgent: params.userAgent,
    userId: revoked.userId,
  });
}

export async function getMe(deps: AuthDeps, userId: string) {
  const [user] = await deps.db
    .select({
      createdAt: users.createdAt,
      email: users.email,
      googleSub: users.googleSub,
      id: users.id,
      lastLoginAt: users.lastLoginAt,
      phoneE164: users.phoneE164,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    throw new AppError("NOT_FOUND", "User not found");
  }

  const photos = await listUserPhotosJson(deps.db, deps.env, userId);
  return {...user, photos};
}
