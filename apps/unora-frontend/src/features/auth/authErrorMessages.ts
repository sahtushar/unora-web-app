import {strings} from "@/features/strings";
import {HttpError} from "@/services/httpError";

const a = strings.auth;

function messageFromBody(body: unknown): string | null {
  if (typeof body !== "object" || body === null) {
    return null;
  }
  const o = body as Record<string, unknown>;
  for (const key of ["message", "error", "detail", "title"] as const) {
    const v = o[key];
    if (typeof v === "string" && v.trim().length > 0) {
      return v;
    }
  }
  const errors = o.errors;
  if (Array.isArray(errors) && errors.length > 0) {
    const first = errors[0];
    if (typeof first === "string") {
      return first;
    }
    if (typeof first === "object" && first !== null && "message" in first) {
      const m = (first as {message?: unknown}).message;
      if (typeof m === "string" && m.trim().length > 0) {
        return m;
      }
    }
  }
  return null;
}

/** Maps API / network failures to user-facing copy for the login screen. */
export function authErrorMessage(err: unknown): string {
  if (err instanceof TypeError) {
    return a.networkError;
  }
  if (err instanceof HttpError) {
    if (err.status === 403) {
      const fromBody = messageFromBody(err.body);
      if (fromBody !== null && fromBody.length > 0) {
        return fromBody;
      }
      return a.googleEmailNotVerified;
    }
    if (err.status === 401) {
      return a.sessionExpired;
    }
    const fromBody = messageFromBody(err.body);
    if (fromBody !== null && fromBody.length > 0) {
      return fromBody;
    }
    if (err.status >= 500) {
      return a.serverError;
    }
  }
  if (err instanceof Error && err.message.length > 0) {
    return err.message;
  }
  return a.googleError;
}
