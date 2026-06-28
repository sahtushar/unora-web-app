/** Stable DOM ids for profile edit sections (deep links / `scrollIntoView`). */
export const PROFILE_CREATION_SECTION_IDS = {
  completion: "unora-profile-edit-completion",
  photos: "unora-profile-edit-photos",
  preferences: "unora-profile-edit-preferences",
  /** Scroll target when returning from the interests picker (`#…` in the URL). */
  interests: "unora-profile-interests",
  verification: "unora-profile-edit-verification",
  bio: "unora-profile-edit-bio",
  basics: "unora-profile-edit-basics",
  lifestyle: "unora-profile-edit-lifestyle",
  conversationStarter: "unora-profile-edit-conversation-starter",
  alignment: "unora-profile-edit-alignment",
} as const;

/** Same as `PROFILE_CREATION_SECTION_IDS.interests` — kept for existing imports. */
export const PROFILE_INTERESTS_SECTION_ID =
  PROFILE_CREATION_SECTION_IDS.interests;
