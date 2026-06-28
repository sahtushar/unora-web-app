import {getAuthHttpBridge} from "@/services/authHttpBridge";

/**
 * When true, `fetchCurrentUser` calls the real API (`GET /v1/auth/me`) and merges
 * with local defaults.
 * Set in `.env`: `VITE_USE_LIVE_USER_PROFILE=true` with `VITE_API_URL` pointing at unora-backend.
 */
export function isLiveUserProfileEnabled(): boolean {
  const v = import.meta.env.VITE_USE_LIVE_USER_PROFILE;
  return v === "true" || v === "1";
}

/**
 * When true, profile photo add/replace/delete call the real API (`POST` / `DELETE /v1/users/me/photos`).
 * Enabled if you have a bearer token and any of:
 * - `VITE_USE_LIVE_USER_PROFILE=true` (same as full live profile), or
 * - `VITE_PROFILE_PHOTO_API=true`, or
 * - `VITE_API_URL` is an absolute `http(s)` URL (typical local backend on :8000).
 */
export function shouldPersistProfilePhotosViaApi(): boolean {
  const token = getAuthHttpBridge()?.getAccessToken();
  if (token === undefined || token.length === 0) {
    return false;
  }
  if (isLiveUserProfileEnabled()) {
    return true;
  }
  const photoFlag = import.meta.env.VITE_PROFILE_PHOTO_API;
  if (photoFlag === "true" || photoFlag === "1") {
    return true;
  }
  const base = import.meta.env.VITE_API_URL;
  if (typeof base === "string" && /^https?:\/\//i.test(base.trim())) {
    return true;
  }
  return false;
}
