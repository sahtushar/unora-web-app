import type {Request} from "express";

import type {Env} from "../config/env.js";
import {AppError} from "./errors.js";

export function assertHttpsInProduction(env: Env, request: Request): void {
  if (!env.REQUIRE_HTTPS || env.NODE_ENV !== "production") {
    return;
  }

  const forwarded = request.headers["x-forwarded-proto"];
  const proto =
    typeof forwarded === "string" ? forwarded.split(",")[0]?.trim() : undefined;

  if (proto !== "https") {
    throw new AppError("FORBIDDEN", "HTTPS is required");
  }
}

export function getClientIp(request: Request): string | undefined {
  const xff = request.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.length > 0) {
    return xff.split(",")[0]?.trim();
  }
  return request.ip;
}
