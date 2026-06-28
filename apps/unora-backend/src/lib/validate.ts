import type {z} from "zod";

import {AppError} from "./errors.js";

export function parseBody<T extends z.ZodTypeAny>(
  schema: T,
  body: unknown
): z.infer<T> {
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw new AppError("BAD_REQUEST", "Validation failed", {
      details: parsed.error.flatten(),
    });
  }
  return parsed.data;
}
