import {HttpError} from "@/services/httpError";

export type GoogleAuthRequestBody = {idToken: string};

export type AuthTokenBundle = {
  accessToken: string;
  refreshToken: string;
  userId: string;
};

export type RefreshRequestBody = {refreshToken: string};

export type LogoutRequestBody = {refreshToken: string};

function apiBase(): string {
  const base = import.meta.env.VITE_API_URL ?? "/api";
  return base.endsWith("/") ? base.slice(0, -1) : base;
}

let refreshChain: Promise<AuthTokenBundle> | null = null;

async function parseJsonOrThrow(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return undefined;
  }
}

/**
 * Serialize refresh calls so proactive refresh and a 401 retry do not race.
 */
export function refreshAuthTokens(
  refreshToken: string
): Promise<AuthTokenBundle> {
  if (!refreshChain) {
    refreshChain = (async () => {
      const url = `${apiBase()}/v1/auth/refresh`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({refreshToken} satisfies RefreshRequestBody),
      });
      const body = await parseJsonOrThrow(res);
      if (!res.ok) {
        throw new HttpError(`Request failed: ${res.status}`, res.status, body);
      }
      return body as AuthTokenBundle;
    })().finally(() => {
      refreshChain = null;
    });
  }
  return refreshChain;
}

export async function postGoogleSignIn(
  idToken: string
): Promise<AuthTokenBundle> {
  const url = `${apiBase()}/v1/auth/google`;
  const res = await fetch(url, {
    method: "POST",
    headers: {"Content-Type": "application/json", Accept: "application/json"},
    body: JSON.stringify({idToken} satisfies GoogleAuthRequestBody),
  });
  const body = await parseJsonOrThrow(res);
  if (!res.ok) {
    throw new HttpError(`Request failed: ${res.status}`, res.status, body);
  }
  return body as AuthTokenBundle;
}

export async function postLogout(refreshToken: string): Promise<void> {
  const url = `${apiBase()}/v1/auth/logout`;
  const res = await fetch(url, {
    method: "POST",
    headers: {"Content-Type": "application/json", Accept: "application/json"},
    body: JSON.stringify({refreshToken} satisfies LogoutRequestBody),
  });
  if (!res.ok) {
    const body = await parseJsonOrThrow(res);
    throw new HttpError(`Request failed: ${res.status}`, res.status, body);
  }
}

export type AuthMeResponse = Record<string, unknown>;

export async function getAuthMe(accessToken: string): Promise<AuthMeResponse> {
  const url = `${apiBase()}/v1/auth/me`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const body = await parseJsonOrThrow(res);
  if (!res.ok) {
    throw new HttpError(`Request failed: ${res.status}`, res.status, body);
  }
  return body as AuthMeResponse;
}
