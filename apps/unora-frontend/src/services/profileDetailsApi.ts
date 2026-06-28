import type {GenderPresentation, Photo, UserLocationDetails} from "@/types";

import {http} from "./http";

/**
 * `preferences` slice returned by `GET` / `PATCH` `/v1/users/me/profile`.
 * `intentions` is the display string used by the relationship-intent dropdown.
 */
export type UserProfilePreferencesDto = {
  ageRange: {max: number; min: number};
  distanceKm: number;
  intentions: string;
  seeking: string[];
  /** Omitted on older API responses; treated as `false` when missing. */
  ageRangeStrict?: boolean;
};

/**
 * `GET /v1/users/me/profile` — profile payload for the editor (extend as backend adds fields).
 */
export type UserProfileDetailsResponse = {
  bio?: string;
  photos: Photo[];
  dateOfBirth?: string;
  displayName?: string;
  gender?: GenderPresentation;
  /** Stable interest catalog ids; omitted on older API responses. */
  interests?: string[];
  location?: string;
  jobTitle?: string;
  companyName?: string;
  degree?: string;
  schoolName?: string;
  hometown?: string;
  /** Height in centimeters; `null` when cleared. */
  height?: number | null;
  /** When false, field is hidden on public discover profile. Omitted = visible (legacy). */
  jobTitlePublic?: boolean;
  companyNamePublic?: boolean;
  degreePublic?: boolean;
  schoolNamePublic?: boolean;
  locationPublic?: boolean;
  hometownPublic?: boolean;
  heightPublic?: boolean;
  preferences?: UserProfilePreferencesDto;
  userLocation?: UserLocationDetails | null;
};

export type PatchUserProfileBody = {
  bio?: string;
  dateOfBirth?: string;
  displayName?: string;
  gender?: GenderPresentation;
  /** Selected interest ids (same keys as profile editor / catalog). */
  interests?: string[];
  location?: string;
  jobTitle?: string;
  companyName?: string;
  degree?: string;
  schoolName?: string;
  hometown?: string;
  /** Height in centimeters; send `null` to clear when the API supports it. */
  height?: number | null;
  jobTitlePublic?: boolean;
  companyNamePublic?: boolean;
  degreePublic?: boolean;
  schoolNamePublic?: boolean;
  locationPublic?: boolean;
  hometownPublic?: boolean;
  heightPublic?: boolean;
  /** Send the full `preferences` object; backend may also accept partials on PATCH. */
  preferences?: UserProfilePreferencesDto;
  userLocation?: UserLocationDetails;
};

/**
 * Loads editable profile details for the signed-in user. Gallery and preferences
 * come from the server when the route exists.
 */
export async function fetchUserProfileDetails(): Promise<UserProfileDetailsResponse> {
  return http.request<UserProfileDetailsResponse>("/v1/users/me/profile");
}

/**
 * Subset / full `preferences` update — `PATCH` body uses the same shape as `UserProfilePreferencesDto` fields.
 */
export async function patchUserProfileDetails(
  body: PatchUserProfileBody
): Promise<UserProfileDetailsResponse> {
  return http.request<UserProfileDetailsResponse>("/v1/users/me/profile", {
    method: "PATCH",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(body),
  });
}
