import * as jose from "jose";

import type {Env} from "../../../config/env.js";
import {AppError} from "../../../lib/errors.js";

export type AccessJwtPayload = {
  sub: string;
  typ: "access";
};

export async function signAccessJwt(env: Env, userId: string): Promise<string> {
  const secret = new TextEncoder().encode(env.JWT_ACCESS_SECRET);
  return new jose.SignJWT({typ: "access"} satisfies Pick<
    AccessJwtPayload,
    "typ"
  >)
    .setSubject(userId)
    .setProtectedHeader({alg: "HS256"})
    .setIssuedAt()
    .setExpirationTime(`${env.ACCESS_TOKEN_TTL_SECONDS}s`)
    .sign(secret);
}

export async function verifyAccessJwt(
  env: Env,
  token: string
): Promise<AccessJwtPayload> {
  try {
    const secret = new TextEncoder().encode(env.JWT_ACCESS_SECRET);
    const {payload} = await jose.jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });
    if (payload["typ"] !== "access") {
      throw new AppError("UNAUTHORIZED", "Invalid token type");
    }
    if (typeof payload.sub !== "string" || payload.sub.length === 0) {
      throw new AppError("UNAUTHORIZED", "Invalid subject");
    }
    return {sub: payload.sub, typ: "access"};
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("UNAUTHORIZED", "Invalid or expired access token");
  }
}
