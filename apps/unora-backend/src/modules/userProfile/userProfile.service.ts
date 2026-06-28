import {eq} from "drizzle-orm";

import type {Env} from "../../config/env.js";
import type {Db} from "../../db/client.js";
import {userMatchPreferences, users} from "../../db/schema.js";
import {AppError} from "../../lib/errors.js";
import {
  listUserPhotosJson,
  userPhotosToProfilePayload,
} from "../userPhotos/userPhoto.service.js";
import {
  type MatchPreferencesJson,
  type ProfileDegree,
  type ProfileGender,
  type UserLocationJson,
  defaultMatchPreferencesJson,
} from "./matchPreferences.js";

export type {
  MatchPreferencesJson,
  ProfileDegree,
  UserLocationJson,
} from "./matchPreferences.js";

export type UserProfileJson = {
  bio: string | null;
  companyName: string | null;
  /** When false, hide `companyName` on public discover views. Missing/legacy treated as true. */
  companyNamePublic: boolean;
  dateOfBirth: string | null;
  degree: ProfileDegree | null;
  degreePublic: boolean;
  displayName: string | null;
  gender: ProfileGender | null;
  height: number | null;
  heightPublic: boolean;
  hometown: string | null;
  hometownPublic: boolean;
  jobTitle: string | null;
  jobTitlePublic: boolean;
  lastName: string | null;
  /**
   * Legacy public-facing label string. Kept in sync with structured `userLocation` when that data exists
   * (precedence: explicit `userLocation.label` on write; otherwise the legacy `location` field).
   */
  location: string | null;
  locationPublic: boolean;
  schoolName: string | null;
  schoolNamePublic: boolean;
  /**
   * Structured user location. Null when the user only has legacy `location` text (or no location at all).
   * Exact lat/lon may be stored in DB; treat as sensitive for public surfaces (this route is the owner "me" view).
   */
  userLocation: UserLocationJson | null;
  interests: string[];
  photos: import("../userPhotos/userPhoto.service.js").UserProfilePhotoJson[];
  preferences: MatchPreferencesJson;
};

type UserProfileBasicsPatch = {
  bio?: string | null;
  companyName?: string | null;
  companyNamePublic?: boolean;
  dateOfBirth?: string;
  degree?: ProfileDegree | null;
  degreePublic?: boolean;
  displayName?: string;
  gender?: ProfileGender;
  height?: number | null;
  heightPublic?: boolean;
  hometown?: string | null;
  hometownPublic?: boolean;
  jobTitle?: string | null;
  jobTitlePublic?: boolean;
  lastName?: string | null;
  location?: string | null;
  locationPublic?: boolean;
  schoolName?: string | null;
  schoolNamePublic?: boolean;
  userLocation?: UserLocationJson | null;
};

/** Basics as shown on another user's discover card (values redacted when `*Public` is false). */
export type DiscoverProfileBasics = {
  companyName: string | null;
  degree: ProfileDegree | null;
  height: number | null;
  hometown: string | null;
  jobTitle: string | null;
  location: string | null;
  schoolName: string | null;
  userLocation: UserLocationJson | null;
};

function basicsVisible(flag: boolean | null | undefined): boolean {
  return flag !== false;
}

/**
 * Strip basics the user marked non-public before exposing another user's profile on discover.
 * Omits `*Public` keys; callers should not merge this back into the owner `me` shape.
 */
export function toDiscoverProfileBasics(
  row: Pick<
    UserProfileJson,
    | "companyName"
    | "companyNamePublic"
    | "degree"
    | "degreePublic"
    | "height"
    | "heightPublic"
    | "hometown"
    | "hometownPublic"
    | "jobTitle"
    | "jobTitlePublic"
    | "location"
    | "locationPublic"
    | "schoolName"
    | "schoolNamePublic"
    | "userLocation"
  >
): DiscoverProfileBasics {
  const locOk = basicsVisible(row.locationPublic);
  return {
    companyName: basicsVisible(row.companyNamePublic) ? row.companyName : null,
    degree: basicsVisible(row.degreePublic) ? row.degree : null,
    height: basicsVisible(row.heightPublic) ? row.height : null,
    hometown: basicsVisible(row.hometownPublic) ? row.hometown : null,
    jobTitle: basicsVisible(row.jobTitlePublic) ? row.jobTitle : null,
    location: locOk ? row.location : null,
    schoolName: basicsVisible(row.schoolNamePublic) ? row.schoolName : null,
    userLocation: locOk ? row.userLocation : null,
  };
}

function formatUserLocationLabel(loc: {
  area: string;
  city: string;
  country: string;
}): string {
  const parts: string[] = [];
  if (loc.area) {
    parts.push(loc.area);
  }
  if (loc.city) {
    parts.push(loc.city);
  }
  if (loc.country) {
    parts.push(loc.country);
  }
  return parts.join(", ");
}

export async function getMatchPreferencesForUser(
  db: Db,
  userId: string
): Promise<MatchPreferencesJson> {
  const [row] = await db
    .select({
      ageMax: userMatchPreferences.ageMax,
      ageMin: userMatchPreferences.ageMin,
      ageRangeStrict: userMatchPreferences.ageRangeStrict,
      distanceKm: userMatchPreferences.distanceKm,
      intentions: userMatchPreferences.intentions,
      seeking: userMatchPreferences.seeking,
    })
    .from(userMatchPreferences)
    .where(eq(userMatchPreferences.userId, userId))
    .limit(1);

  if (row === undefined) {
    return defaultMatchPreferencesJson;
  }

  return {
    ageRange: {max: row.ageMax, min: row.ageMin},
    ageRangeStrict: row.ageRangeStrict,
    distanceKm: row.distanceKm,
    intentions: row.intentions,
    seeking: row.seeking as MatchPreferencesJson["seeking"],
  };
}

export async function assertUserExists(db: Db, userId: string): Promise<void> {
  const [row] = await db
    .select({id: users.id})
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!row) {
    throw new AppError("NOT_FOUND", "User not found");
  }
}

export async function getUserInterestsForUser(
  db: Db,
  userId: string
): Promise<string[]> {
  const [row] = await db
    .select({interests: users.interests})
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (row === undefined) {
    return [];
  }
  return [...row.interests];
}

export async function updateUserProfileInterests(
  db: Db,
  userId: string,
  interests: string[]
): Promise<void> {
  const now = new Date();
  await db
    .update(users)
    .set({interests, updatedAt: now})
    .where(eq(users.id, userId));
}

export async function updateUserProfileBasics(
  db: Db,
  userId: string,
  patch: UserProfileBasicsPatch
): Promise<void> {
  const now = new Date();
  const updatePayload: {
    updatedAt: Date;
    bio?: string | null;
    companyName?: string | null;
    companyNamePublic?: boolean;
    dateOfBirth?: string;
    degree?: ProfileDegree | null;
    degreePublic?: boolean;
    displayName?: string;
    gender?: ProfileGender;
    heightCm?: number | null;
    heightPublic?: boolean;
    hometown?: string | null;
    hometownPublic?: boolean;
    jobTitle?: string | null;
    jobTitlePublic?: boolean;
    lastName?: string | null;
    location?: string | null;
    locationPublic?: boolean;
    schoolName?: string | null;
    schoolNamePublic?: boolean;
    userLocation?: UserLocationJson | null;
  } = {updatedAt: now};

  if (patch.displayName !== undefined) {
    updatePayload.displayName = patch.displayName;
  }
  if (patch.bio !== undefined) {
    updatePayload.bio = patch.bio;
  }
  if (patch.companyName !== undefined) {
    updatePayload.companyName = patch.companyName;
  }
  if (patch.companyNamePublic !== undefined) {
    updatePayload.companyNamePublic = patch.companyNamePublic;
  }
  if (patch.dateOfBirth !== undefined) {
    updatePayload.dateOfBirth = patch.dateOfBirth;
  }
  if (patch.degree !== undefined) {
    updatePayload.degree = patch.degree;
  }
  if (patch.degreePublic !== undefined) {
    updatePayload.degreePublic = patch.degreePublic;
  }
  if (patch.gender !== undefined) {
    updatePayload.gender = patch.gender;
  }
  if (patch.height !== undefined) {
    updatePayload.heightCm = patch.height;
  }
  if (patch.heightPublic !== undefined) {
    updatePayload.heightPublic = patch.heightPublic;
  }
  if (patch.hometown !== undefined) {
    updatePayload.hometown = patch.hometown;
  }
  if (patch.hometownPublic !== undefined) {
    updatePayload.hometownPublic = patch.hometownPublic;
  }
  if (patch.jobTitle !== undefined) {
    updatePayload.jobTitle = patch.jobTitle;
  }
  if (patch.jobTitlePublic !== undefined) {
    updatePayload.jobTitlePublic = patch.jobTitlePublic;
  }
  if (patch.lastName !== undefined) {
    updatePayload.lastName = patch.lastName;
  }
  if (patch.location !== undefined) {
    updatePayload.location = patch.location;
  }
  if (patch.locationPublic !== undefined) {
    updatePayload.locationPublic = patch.locationPublic;
  }
  if (patch.schoolName !== undefined) {
    updatePayload.schoolName = patch.schoolName;
  }
  if (patch.schoolNamePublic !== undefined) {
    updatePayload.schoolNamePublic = patch.schoolNamePublic;
  }
  if (patch.userLocation !== undefined) {
    updatePayload.userLocation = patch.userLocation;
  }

  await db.update(users).set(updatePayload).where(eq(users.id, userId));
}

export async function getUserBasicProfileForUser(
  db: Db,
  userId: string
): Promise<
  Pick<
    UserProfileJson,
    | "bio"
    | "companyName"
    | "companyNamePublic"
    | "dateOfBirth"
    | "degree"
    | "degreePublic"
    | "displayName"
    | "gender"
    | "height"
    | "heightPublic"
    | "hometown"
    | "hometownPublic"
    | "jobTitle"
    | "jobTitlePublic"
    | "lastName"
    | "location"
    | "locationPublic"
    | "schoolName"
    | "schoolNamePublic"
    | "userLocation"
  >
> {
  const [row] = await db
    .select({
      bio: users.bio,
      companyName: users.companyName,
      companyNamePublic: users.companyNamePublic,
      dateOfBirth: users.dateOfBirth,
      degree: users.degree,
      degreePublic: users.degreePublic,
      displayName: users.displayName,
      gender: users.gender,
      heightCm: users.heightCm,
      heightPublic: users.heightPublic,
      hometown: users.hometown,
      hometownPublic: users.hometownPublic,
      jobTitle: users.jobTitle,
      jobTitlePublic: users.jobTitlePublic,
      lastName: users.lastName,
      location: users.location,
      locationPublic: users.locationPublic,
      schoolName: users.schoolName,
      schoolNamePublic: users.schoolNamePublic,
      userLocation: users.userLocation,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const userLocation = row?.userLocation;
  if (userLocation) {
    const outUserLocation: UserLocationJson = {
      area: userLocation.area,
      city: userLocation.city,
      country: userLocation.country,
      label: userLocation.label,
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
    };
    return {
      bio: row?.bio ?? null,
      companyName: row?.companyName ?? null,
      companyNamePublic: row?.companyNamePublic !== false,
      dateOfBirth: row?.dateOfBirth ?? null,
      degree: row?.degree ?? null,
      degreePublic: row?.degreePublic !== false,
      displayName: row?.displayName ?? null,
      gender: (row?.gender as ProfileGender | null | undefined) ?? null,
      height: row?.heightCm ?? null,
      heightPublic: row?.heightPublic !== false,
      hometown: row?.hometown ?? null,
      hometownPublic: row?.hometownPublic !== false,
      jobTitle: row?.jobTitle ?? null,
      jobTitlePublic: row?.jobTitlePublic !== false,
      lastName: row?.lastName ?? null,
      schoolName: row?.schoolName ?? null,
      schoolNamePublic: row?.schoolNamePublic !== false,
      userLocation: outUserLocation,
      location:
        outUserLocation.label ||
        row?.location ||
        formatUserLocationLabel(outUserLocation) ||
        null,
      locationPublic: row?.locationPublic !== false,
    };
  }

  return {
    bio: row?.bio ?? null,
    companyName: row?.companyName ?? null,
    companyNamePublic: row?.companyNamePublic !== false,
    dateOfBirth: row?.dateOfBirth ?? null,
    degree: row?.degree ?? null,
    degreePublic: row?.degreePublic !== false,
    displayName: row?.displayName ?? null,
    gender: (row?.gender as ProfileGender | null | undefined) ?? null,
    height: row?.heightCm ?? null,
    heightPublic: row?.heightPublic !== false,
    hometown: row?.hometown ?? null,
    hometownPublic: row?.hometownPublic !== false,
    jobTitle: row?.jobTitle ?? null,
    jobTitlePublic: row?.jobTitlePublic !== false,
    lastName: row?.lastName ?? null,
    schoolName: row?.schoolName ?? null,
    schoolNamePublic: row?.schoolNamePublic !== false,
    location: row?.location ?? null,
    locationPublic: row?.locationPublic !== false,
    userLocation: null,
  };
}

export async function upsertUserMatchPreferences(
  db: Db,
  userId: string,
  preferences: MatchPreferencesJson
): Promise<void> {
  const now = new Date();
  await db
    .insert(userMatchPreferences)
    .values({
      ageMax: preferences.ageRange.max,
      ageMin: preferences.ageRange.min,
      ageRangeStrict: preferences.ageRangeStrict,
      distanceKm: preferences.distanceKm,
      intentions: preferences.intentions,
      seeking: preferences.seeking,
      updatedAt: now,
      userId,
    })
    .onConflictDoUpdate({
      set: {
        ageMax: preferences.ageRange.max,
        ageMin: preferences.ageRange.min,
        ageRangeStrict: preferences.ageRangeStrict,
        distanceKm: preferences.distanceKm,
        intentions: preferences.intentions,
        seeking: preferences.seeking,
        updatedAt: now,
      },
      target: userMatchPreferences.userId,
    });
}

/**
 * `GET /v1/users/me/profile` — photos, match preferences, and interest catalog ids.
 */
export async function getUserProfileJson(
  db: Db,
  env: Env,
  userId: string
): Promise<UserProfileJson> {
  const [basicProfile, photos, preferences, interests] = await Promise.all([
    getUserBasicProfileForUser(db, userId),
    listUserPhotosJson(db, env, userId),
    getMatchPreferencesForUser(db, userId),
    getUserInterestsForUser(db, userId),
  ]);
  return {
    ...basicProfile,
    interests,
    ...userPhotosToProfilePayload(photos),
    preferences,
  };
}
