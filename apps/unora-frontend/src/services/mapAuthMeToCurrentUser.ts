import {mockCurrentUser} from "@/data/mock/session";
import {normalizePhotoMediaUrls} from "@/lib/resolveMediaUrl";
import type {CurrentUserProfile} from "@/types";

import type {ApiAuthMeResponse} from "./apiAuthMe";

/**
 * Overlay API identity onto the in-app profile shape until a dedicated profile API exists.
 */
export function mapAuthMeToCurrentUser(
  api: ApiAuthMeResponse
): CurrentUserProfile {
  const base = structuredClone(mockCurrentUser);
  base.id = api.id;
  base.email = api.email ?? base.email;
  if (Array.isArray(api.photos)) {
    base.photos = api.photos.map(normalizePhotoMediaUrls);
  }
  return base;
}
