import {
  getDiscoverProfileById,
  mockCurrentUser,
  mockSession,
} from "@/data/mock/session";
import {mockApiDelay} from "@/lib/mockApiDelay";
import {normalizePhotoMediaUrls} from "@/lib/resolveMediaUrl";
import type {
  AppSessionState,
  CurrentUserProfile,
  DiscoverProfile,
} from "@/types";

import type {ApiAuthMeResponse} from "./apiAuthMe";
import {http} from "./http";
import {
  isLiveUserProfileEnabled,
  shouldPersistProfilePhotosViaApi,
} from "./liveProfile";
import {mapAuthMeToCurrentUser} from "./mapAuthMeToCurrentUser";
import {
  type UserProfilePreferencesDto,
  fetchUserProfileDetails,
} from "./profileDetailsApi";

export async function fetchSessionState(): Promise<AppSessionState> {
  await mockApiDelay();
  return structuredClone(mockSession);
}

export async function fetchDiscoverQueue(): Promise<DiscoverProfile[]> {
  await mockApiDelay();
  return structuredClone(mockSession.discoverQueue);
}

export async function fetchDiscoverProfileById(
  id: string
): Promise<DiscoverProfile | null> {
  await mockApiDelay();
  const found = getDiscoverProfileById(id);
  return found ? structuredClone(found) : null;
}

function normalizeUserPreferencesFromApi(
  p: UserProfilePreferencesDto
): CurrentUserProfile["preferences"] {
  let min = Math.max(18, Math.min(99, p.ageRange?.min ?? 18));
  let max = Math.max(18, Math.min(99, p.ageRange?.max ?? 99));
  if (min > max) {
    [min, max] = [max, min];
  }
  const distanceKm = Math.max(0, Math.min(500, p.distanceKm ?? 40));
  return {
    seeking: Array.isArray(p.seeking) ? [...p.seeking] : [],
    ageRange: {min, max},
    ageRangeStrict: p.ageRangeStrict === true,
    distanceKm,
    intentions: typeof p.intentions === "string" ? p.intentions : "",
  };
}

/** When the profile API is on, overlays `GET /v1/users/me/profile` (photos, preferences) onto `user`. */
async function mergeUserProfileDetailsFromApi(
  user: CurrentUserProfile
): Promise<CurrentUserProfile> {
  if (!shouldPersistProfilePhotosViaApi()) {
    return user;
  }
  try {
    const details = await fetchUserProfileDetails();
    let next = user;
    if (Array.isArray(details.photos)) {
      next = {
        ...next,
        photos: details.photos.map(normalizePhotoMediaUrls),
      };
    }
    if (details.preferences !== undefined) {
      next = {
        ...next,
        preferences: normalizeUserPreferencesFromApi(details.preferences),
      };
    }
    if (details.interests !== undefined) {
      next = {
        ...next,
        interests: Array.isArray(details.interests)
          ? [...details.interests]
          : next.interests,
      };
    }
    if (typeof details.displayName === "string") {
      next = {...next, displayName: details.displayName};
    }
    if (typeof details.dateOfBirth === "string") {
      next = {...next, dateOfBirth: details.dateOfBirth};
    }
    if (typeof details.gender === "string") {
      next = {...next, gender: details.gender};
    }
    if (typeof details.location === "string") {
      next = {...next, location: details.location};
    }
    if (typeof details.jobTitle === "string") {
      next = {...next, jobTitle: details.jobTitle};
    }
    if (typeof details.companyName === "string") {
      next = {...next, companyName: details.companyName};
    }
    if (typeof details.degree === "string") {
      next = {...next, degree: details.degree};
    }
    if (typeof details.schoolName === "string") {
      next = {...next, schoolName: details.schoolName};
    }
    if (typeof details.hometown === "string") {
      next = {...next, hometown: details.hometown};
    }
    if (details.height !== undefined) {
      next = {
        ...next,
        height: details.height === null ? "" : String(details.height),
      };
    }
    if (typeof details.jobTitlePublic === "boolean") {
      next = {...next, jobTitlePublic: details.jobTitlePublic};
    }
    if (typeof details.companyNamePublic === "boolean") {
      next = {...next, companyNamePublic: details.companyNamePublic};
    }
    if (typeof details.degreePublic === "boolean") {
      next = {...next, degreePublic: details.degreePublic};
    }
    if (typeof details.schoolNamePublic === "boolean") {
      next = {...next, schoolNamePublic: details.schoolNamePublic};
    }
    if (typeof details.locationPublic === "boolean") {
      next = {...next, locationPublic: details.locationPublic};
    }
    if (typeof details.hometownPublic === "boolean") {
      next = {...next, hometownPublic: details.hometownPublic};
    }
    if (typeof details.heightPublic === "boolean") {
      next = {...next, heightPublic: details.heightPublic};
    }
    if (details.userLocation !== undefined) {
      next = {...next, userLocation: details.userLocation};
    }
    return next;
  } catch {
    return user;
  }
}

/**
 * Default: mock profile + delay. With `VITE_USE_LIVE_USER_PROFILE`, loads `GET /v1/auth/me`
 * and merges (`mapAuthMeToCurrentUser`). Whenever `shouldPersistProfilePhotosViaApi()` is true,
 * also loads **`GET /v1/users/me/profile`** so **gallery `photos`, `preferences`, and basics fields (when present) come from the API** when the route returns them, not only mock.
 */
export async function fetchCurrentUser(): Promise<CurrentUserProfile> {
  if (!isLiveUserProfileEnabled()) {
    await mockApiDelay();
    const base = structuredClone(mockCurrentUser);
    return mergeUserProfileDetailsFromApi(base);
  }
  const me = await http.request<ApiAuthMeResponse>("/v1/auth/me");
  const merged = mapAuthMeToCurrentUser(me);
  return mergeUserProfileDetailsFromApi(merged);
}
