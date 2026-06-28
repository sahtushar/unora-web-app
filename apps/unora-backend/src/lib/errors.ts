export type ErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "INTERNAL";

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly expose: boolean;
  public readonly details?: unknown;

  constructor(
    code: ErrorCode,
    message: string,
    options?: {details?: unknown; expose?: boolean; statusCode?: number}
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = options?.statusCode ?? statusForCode(code);
    this.expose = options?.expose ?? code !== "INTERNAL";
    this.details = options?.details;
  }
}

function statusForCode(code: ErrorCode): number {
  switch (code) {
    case "BAD_REQUEST":
      return 400;
    case "UNAUTHORIZED":
      return 401;
    case "FORBIDDEN":
      return 403;
    case "NOT_FOUND":
      return 404;
    case "CONFLICT":
      return 409;
    case "RATE_LIMITED":
      return 429;
    default:
      return 500;
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
