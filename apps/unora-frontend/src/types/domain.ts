/** Core domain types for Unora — swap mock implementations for API DTOs + mappers later. */

export type UserId = string;

export type GenderPresentation =
  | "woman"
  | "man"
  | "nonbinary"
  | "prefer_not_say";

export interface Photo {
  alt: string;
  id: string;
  url: string;
  /** Set when integrating real CDN URLs; LazyImage reads this. */
  blurDataUrl?: string;
}

export interface CompatibilitySummary {
  bullets: string[];
  scoreLabel: string;
  /** Short explainability for “Why this match”. */
  whyThisMatch: string;
}

/**
 * Keys for `strings.profile.profileCreation.preferences.intentionPresets`
 * (what someone is looking for — preset chips in profile creation).
 */
export const DATING_INTENTION_PRESET_IDS = [
  "serious_when_right",
  "open_exploring",
  "friends_first",
  "life_partner",
  "figuring_out",
] as const;

export type DatingIntentionPresetId =
  (typeof DATING_INTENTION_PRESET_IDS)[number];

/** Lifestyle selects — stable keys; labels in `strings.profile.profileCreation.selectOptions`. */
export const HAVE_KIDS_OPTION_IDS = ["no", "yes", "prefer_not_to_say"] as const;

export type HaveKidsOptionId = (typeof HAVE_KIDS_OPTION_IDS)[number];

export const POLITICS_OPTION_IDS = [
  "liberal",
  "moderate",
  "conservative",
  "progressive",
  "libertarian",
  "independent",
  "apolitical",
  "other",
  "prefer_not_to_say",
] as const;

export type PoliticsOptionId = (typeof POLITICS_OPTION_IDS)[number];

export const RELIGION_OPTION_IDS = [
  "agnostic",
  "atheist",
  "buddhist",
  "christian",
  "hindu",
  "jewish",
  "muslim",
  "sikh",
  "spiritual_not_religious",
  "other",
  "prefer_not_to_say",
] as const;

export type ReligionOptionId = (typeof RELIGION_OPTION_IDS)[number];

export const PRONOUNS_OPTION_IDS = [
  "she_her",
  "he_him",
  "they_them",
  "she_they",
  "he_they",
  "they_she",
  "other",
  "prefer_not_to_say",
] as const;

export type PronounsOptionId = (typeof PRONOUNS_OPTION_IDS)[number];

/** Trust signals shown on discover (mirrors profile creation verification). */
export interface DiscoverProfileVerification {
  id: boolean;
  phone: boolean;
  photo: boolean;
}

/**
 * Public discover card + detailed view shape.
 * Basics / lifestyle / prompt / alignment lines mirror `ProfileCreationDraft` for mock + future API mapping.
 */
export interface DiscoverProfile {
  age: number;
  bio: string;
  /** Current city — shown on cards and in location. */
  city: string;
  companyName: string;
  compatibility: CompatibilitySummary;
  /** `DEGREE_VALUES` key or empty. */
  degree: string;
  displayName: string;
  drinking: string;
  exercise: string;
  haveKids: HaveKidsOptionId | "";
  headline: string;
  /** Height in cm as digits (same storage as profile creation). */
  height: string;
  hometown: string;
  id: UserId;
  /**
   * Preset id for what they’re looking for — same keys as
   * `strings.profile.profileCreation.preferences.intentionPresets`.
   */
  intentions: DatingIntentionPresetId;
  /** Keys from `INTEREST_IDS` / profile creation interest picker. */
  interestIds: readonly string[];
  jobTitle: string;
  kids: string;
  languages: string;
  photos: Photo[];
  politics: PoliticsOptionId | "";
  promptAnswer: string;
  pronouns: PronounsOptionId | "";
  religion: ReligionOptionId | "";
  schoolName: string;
  smoking: string;
  verification: DiscoverProfileVerification;
  zodiac: string;
}

export type InterestedStatus = "ready_to_connect" | "waiting";

export interface InterestedPerson {
  /** Human-readable context, e.g. mutual interest timing */
  contextLine: string;
  displayName: string;
  id: UserId;
  matchedAt: string;
  photo: Photo;
  status: InterestedStatus;
  /** Shown on match tiles when provided by the API / profile. */
  age?: number;
}

export interface ChatMessage {
  authorId: UserId;
  body: string;
  id: string;
  sentAt: string;
}

export interface ActiveConnection {
  /** ISO timestamp when connection became active */
  connectedAt: string;
  conversationStarters: string[];
  messages: ChatMessage[];
  peer: DiscoverProfile;
}

export interface UserLocationDetails {
  area: string;
  city: string;
  country: string;
  /** Public-facing line shown on profile (neighborhood / city level). */
  label: string;
  latitude: number;
  longitude: number;
}

export interface CurrentUserProfile {
  /** Shown on the profile hub; Discover uses its own profile cards. */
  age: number;
  bio: string;
  completeness: {
    missing: string[];
    percent: number;
  };
  displayName: string;
  email: string;
  gender: GenderPresentation;
  id: UserId;
  /**
   * Interest catalog ids from profile edit / `GET /v1/users/me/profile` when present.
   * Distinct from discover `interestIds` on other models — same string keys as `ProfileCreationDraft["interests"]`.
   */
  interests: string[];
  photos: Photo[];
  preferences: {
    ageRange: {max: number; min: number};
    /**
     * When true, the age range is a strict match filter (stronger than a soft preference).
     */
    ageRangeStrict: boolean;
    distanceKm: number;
    intentions: string;
    seeking: string[];
  };
  verification: {
    id: boolean;
    phone: boolean;
    photo: boolean;
  };
  /**
   * Up to three “What lines up” lines (mirrors `DiscoverProfile.compatibility.bullets`);
   * edited in profile creation / edit.
   */
  alignmentBullets?: readonly string[];
  /** Optional full DOB collected in onboarding flow (`YYYY-MM-DD`). */
  dateOfBirth?: string;
  /** Optional current city / neighborhood from onboarding. */
  location?: string;
  /** Rich location details when provided by `GET` / `PATCH` `/v1/users/me/profile` (API may return `null`). */
  userLocation?: UserLocationDetails | null;
  /** Basics card — from profile editor / `GET` / `PATCH` `/v1/users/me/profile` when present. */
  jobTitle?: string;
  companyName?: string;
  /** `DEGREE_VALUES` key or empty. */
  degree?: string;
  schoolName?: string;
  hometown?: string;
  /** Height in cm as digits (same as `ProfileCreationDraft["height"]`). */
  height?: string;
  /** When false, hide this basics field on discover / public profile. Omitted = treat as visible (legacy). */
  jobTitlePublic?: boolean;
  companyNamePublic?: boolean;
  degreePublic?: boolean;
  schoolNamePublic?: boolean;
  locationPublic?: boolean;
  hometownPublic?: boolean;
  heightPublic?: boolean;
}

export interface AppSessionState {
  /** Woman-first rule: at most one active connection in product model */
  activeConnection: ActiveConnection | null;
  currentUserId: UserId;
  discoverQueue: DiscoverProfile[];
  interested: InterestedPerson[];
}
