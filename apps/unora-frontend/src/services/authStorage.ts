/** Access token: same persistence as the legacy mock phone path (localStorage). */
const ACCESS_KEY = "unora_access_token";
const LEGACY_ACCESS_KEY = "unora_mock_auth_token";
/** Refresh token: sessionStorage only — survives reload within the tab, not localStorage. */
const REFRESH_KEY = "unora_refresh_token";

export function readStoredAccessToken(): string | null {
  const next = localStorage.getItem(ACCESS_KEY);
  if (next !== null && next.length > 0) {
    return next;
  }
  const legacy = localStorage.getItem(LEGACY_ACCESS_KEY);
  if (legacy !== null && legacy.length > 0) {
    localStorage.setItem(ACCESS_KEY, legacy);
    localStorage.removeItem(LEGACY_ACCESS_KEY);
    return legacy;
  }
  return null;
}

export function readStoredRefreshToken(): string | null {
  return sessionStorage.getItem(REFRESH_KEY);
}

export function persistAccessTokenOnly(accessToken: string): void {
  localStorage.setItem(ACCESS_KEY, accessToken);
  sessionStorage.removeItem(REFRESH_KEY);
}

export function persistAuthPair(
  accessToken: string,
  refreshToken: string
): void {
  localStorage.setItem(ACCESS_KEY, accessToken);
  sessionStorage.setItem(REFRESH_KEY, refreshToken);
}

export function clearAuthStorage(): void {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(LEGACY_ACCESS_KEY);
  sessionStorage.removeItem(REFRESH_KEY);
  try {
    sessionStorage.clear();
  } catch {
    /* ignore (private mode / storage blocked) */
  }
}
