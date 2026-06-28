import type {CurrentUserProfile} from "@/types";

import {ABOUT_MIN_LENGTH} from "./profileCompletion/types";
import {PROFILE_CREATION_MIN_INTERESTS} from "./profileCreationModel";

function hasRealDisplayName(name: string): boolean {
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return false;
  }
  const lowered = trimmed.toLowerCase();
  return lowered !== "you";
}

export function isProfileCompletionRequired(user: CurrentUserProfile): boolean {
  const basicsReady =
    hasRealDisplayName(user.displayName) &&
    typeof user.dateOfBirth === "string" &&
    user.dateOfBirth.trim().length > 0 &&
    typeof user.gender === "string" &&
    user.gender.trim().length > 0;
  const preferencesReady =
    user.preferences.seeking.length > 0 &&
    user.preferences.intentions.trim().length > 0;
  const interestsReady =
    user.interests.length >= PROFILE_CREATION_MIN_INTERESTS;
  const aboutReady = user.bio.trim().length >= ABOUT_MIN_LENGTH;
  const loc = user.userLocation;
  const locationReady =
    typeof user.location === "string" &&
    user.location.trim().length > 0 &&
    loc != null &&
    typeof loc.label === "string" &&
    loc.label.trim().length > 0 &&
    Number.isFinite(loc.latitude) &&
    Number.isFinite(loc.longitude) &&
    loc.country.trim().length > 0;

  return !(
    basicsReady &&
    preferencesReady &&
    interestsReady &&
    aboutReady &&
    locationReady
  );
}
