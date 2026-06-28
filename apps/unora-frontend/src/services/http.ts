/**
 * Thin fetch wrapper — swap base URL / auth headers when backend exists.
 * Keep services free of React; hooks compose this layer + React Query.
 */
import {refreshAuthTokens} from "@/services/authApi";
import {getAuthHttpBridge} from "@/services/authHttpBridge";
import {HttpError} from "@/services/httpError";
import {emitHttpUnauthorized} from "@/services/httpEvents";

export {HttpError} from "@/services/httpError";

export interface HttpClientConfig {
  baseUrl: string;
  /** When true, one 401 response triggers refresh + a single retry (see `authHttpBridge`). */
  refreshOnUnauthorized?: boolean;
  getToken?: () => string | undefined;
}

function normalizeBaseUrl(base: string): string {
  return base.endsWith("/") ? base.slice(0, -1) : base;
}

export function createHttpClient(config: HttpClientConfig) {
  const root = normalizeBaseUrl(config.baseUrl);

  async function rawFetch(
    path: string,
    init: RequestInit,
    didRefresh?: boolean
  ): Promise<Response> {
    const pathPart = path.startsWith("/") ? path : `/${path}`;
    const url = `${root}${pathPart}`;
    const headers = new Headers(init.headers);
    headers.set("Accept", "application/json");
    const token = config.getToken?.();
    const bridge = getAuthHttpBridge();
    const hadRefreshToken = (() => {
      const refresh = bridge?.getRefreshToken?.();
      return refresh !== undefined && refresh.length > 0;
    })();
    if (token !== undefined && token.length > 0) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const res = await fetch(url, {...init, headers});

    if (
      res.status === 401 &&
      config.refreshOnUnauthorized === true &&
      didRefresh !== true &&
      !path.startsWith("/v1/auth/refresh")
    ) {
      const b = bridge;
      const refresh = b?.getRefreshToken?.();
      if (refresh !== undefined && refresh.length > 0) {
        try {
          const bundle = await refreshAuthTokens(refresh);
          b?.applyRefreshedTokens(bundle.accessToken, bundle.refreshToken);
          return rawFetch(path, init, true);
        } catch {
          b?.clearSession();
        }
      }
    }

    if (
      res.status === 401 &&
      !path.startsWith("/v1/auth/refresh") &&
      ((token !== undefined && token.length > 0) ||
        hadRefreshToken ||
        didRefresh === true)
    ) {
      emitHttpUnauthorized(path);
    }

    return res;
  }

  async function request<T>(
    path: string,
    init?: RequestInit,
    didRefresh?: boolean
  ): Promise<T> {
    const headers = new Headers(init?.headers);
    const res = await rawFetch(path, {...init, headers}, didRefresh);

    if (!res.ok) {
      let body: unknown;
      try {
        body = await res.json();
      } catch {
        body = undefined;
      }
      throw new HttpError(`Request failed: ${res.status}`, res.status, body);
    }
    return (await res.json()) as T;
  }

  /** JSON DELETE (or other verbs) — tolerates `204` / empty body. */
  async function requestVoid(
    path: string,
    init?: RequestInit,
    didRefresh?: boolean
  ): Promise<void> {
    const headers = new Headers(init?.headers);
    const res = await rawFetch(path, {...init, headers}, didRefresh);

    if (!res.ok) {
      let body: unknown;
      try {
        body = await res.json();
      } catch {
        body = undefined;
      }
      throw new HttpError(`Request failed: ${res.status}`, res.status, body);
    }
    if (res.status === 204) {
      return;
    }
    await res.text();
  }

  /**
   * Multipart POST — do not set `Content-Type` so the browser adds the boundary.
   */
  async function requestForm<T>(
    path: string,
    formData: FormData,
    didRefresh?: boolean
  ): Promise<T> {
    const res = await rawFetch(
      path,
      {
        method: "POST",
        body: formData,
      },
      didRefresh
    );

    if (!res.ok) {
      let body: unknown;
      try {
        body = await res.json();
      } catch {
        body = undefined;
      }
      throw new HttpError(`Request failed: ${res.status}`, res.status, body);
    }
    return (await res.json()) as T;
  }

  return {request, requestForm, requestVoid};
}

/** Default client: `VITE_API_URL` base, bearer from `authHttpBridge`, refresh-on-401 when a refresh token exists. */
export const http = createHttpClient({
  baseUrl: import.meta.env.VITE_API_URL ?? "/api",
  getToken: () => getAuthHttpBridge()?.getAccessToken(),
  refreshOnUnauthorized: true,
});
