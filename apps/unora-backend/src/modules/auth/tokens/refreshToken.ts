import argon2 from "argon2";
import {and, eq, gt, isNull} from "drizzle-orm";
import {createHash, randomBytes} from "node:crypto";

import type {Env} from "../../../config/env.js";
import type {Db} from "../../../db/client.js";
import {refreshTokens} from "../../../db/schema.js";
import {AppError} from "../../../lib/errors.js";
import {signAccessJwt} from "./accessJwt.js";

export function mintRefreshToken(): {lookupHash: string; raw: string} {
  const raw = randomBytes(48).toString("base64url");
  const lookupHash = createHash("sha256").update(raw).digest("hex");
  return {lookupHash, raw};
}

export async function hashRefreshToken(raw: string): Promise<string> {
  return argon2.hash(raw, {type: argon2.argon2id});
}

export async function verifyRefreshTokenHash(
  hash: string,
  raw: string
): Promise<boolean> {
  try {
    return await argon2.verify(hash, raw);
  } catch {
    return false;
  }
}

export async function insertRefreshTokenRow(
  db: Db,
  params: {
    env: Env;
    hashedToken: string;
    lookupHash: string;
    userId: string;
    ip?: string;
    userAgent?: string;
  }
): Promise<{id: string}> {
  const expiresAt = new Date(
    Date.now() + params.env.REFRESH_TOKEN_TTL_DAYS * 86_400_000
  );

  const [row] = await db
    .insert(refreshTokens)
    .values({
      expiresAt,
      hashedToken: params.hashedToken,
      ip: params.ip ?? null,
      lookupHash: params.lookupHash,
      userAgent: params.userAgent ?? null,
      userId: params.userId,
    })
    .returning({id: refreshTokens.id});

  if (!row) {
    throw new AppError("INTERNAL", "Failed to persist refresh token");
  }

  return {id: row.id};
}

export async function rotateRefreshToken(
  db: Db,
  params: {
    env: Env;
    raw: string;
    ip?: string;
    userAgent?: string;
  }
): Promise<{accessToken: string; refreshToken: string; userId: string}> {
  const lookupHash = createHash("sha256").update(params.raw).digest("hex");

  const [existing] = await db
    .select()
    .from(refreshTokens)
    .where(
      and(
        eq(refreshTokens.lookupHash, lookupHash),
        isNull(refreshTokens.revokedAt),
        gt(refreshTokens.expiresAt, new Date())
      )
    )
    .limit(1);

  if (!existing) {
    throw new AppError("UNAUTHORIZED", "Invalid refresh token");
  }

  const valid = await verifyRefreshTokenHash(existing.hashedToken, params.raw);
  if (!valid) {
    throw new AppError("UNAUTHORIZED", "Invalid refresh token");
  }

  const next = mintRefreshToken();
  const nextHash = await hashRefreshToken(next.raw);

  await db.transaction(async (tx) => {
    const [inserted] = await tx
      .insert(refreshTokens)
      .values({
        expiresAt: new Date(
          Date.now() + params.env.REFRESH_TOKEN_TTL_DAYS * 86_400_000
        ),
        hashedToken: nextHash,
        ip: params.ip ?? null,
        lookupHash: next.lookupHash,
        userAgent: params.userAgent ?? null,
        userId: existing.userId,
      })
      .returning({id: refreshTokens.id});

    if (!inserted) {
      throw new AppError("INTERNAL", "Failed to rotate refresh token");
    }

    await tx
      .update(refreshTokens)
      .set({
        replacedByTokenId: inserted.id,
        revokedAt: new Date(),
      })
      .where(eq(refreshTokens.id, existing.id));
  });

  const accessToken = await signAccessJwt(params.env, existing.userId);

  return {
    accessToken,
    refreshToken: next.raw,
    userId: existing.userId,
  };
}

export async function revokeRefreshTokenByRaw(
  db: Db,
  raw: string
): Promise<{userId: string} | null> {
  const lookupHash = createHash("sha256").update(raw).digest("hex");
  const [existing] = await db
    .select()
    .from(refreshTokens)
    .where(
      and(
        eq(refreshTokens.lookupHash, lookupHash),
        isNull(refreshTokens.revokedAt)
      )
    )
    .limit(1);

  if (!existing) {
    return null;
  }

  const valid = await verifyRefreshTokenHash(existing.hashedToken, raw);
  if (!valid) {
    return null;
  }

  await db
    .update(refreshTokens)
    .set({revokedAt: new Date()})
    .where(eq(refreshTokens.id, existing.id));

  return {userId: existing.userId};
}
