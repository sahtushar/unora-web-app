/** Future API contracts — keep DTOs separate from domain where shapes diverge. */

export interface ApiResult<T> {
  data: T;
  /** Correlation id for support / logging */
  requestId?: string;
}

export interface ApiErrorBody {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
