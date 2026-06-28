/** Local profile-editing shape; wire to API when backend exists. */
import type {PatchUserProfileBody} from "@/services/profileDetailsApi";
import type {
  CurrentUserProfile,
  HaveKidsOptionId,
  PoliticsOptionId,
  PronounsOptionId,
  ReligionOptionId,
} from "@/types";

export {DATING_INTENTION_PRESET_IDS as DATING_INTENTION_KEYS} from "@/types";
export type {DatingIntentionPresetId as DatingIntentionKey} from "@/types";

export type ProfilePreferencesDraft = {
  ageMax: number;
  ageMin: number;
  ageRangeStrict: boolean;
  distanceKm: number;
  intentions: string;
  seeking: string[];
};

/** Maps the preferences editor state to `CurrentUserProfile["preferences"]` (API / store shape). */
export function profilePreferencesDraftToUserSlice(
  d: ProfilePreferencesDraft
): CurrentUserProfile["preferences"] {
  return {
    seeking: [...d.seeking],
    ageRange: {min: d.ageMin, max: d.ageMax},
    ageRangeStrict: d.ageRangeStrict,
    distanceKm: d.distanceKm,
    intentions: d.intentions,
  };
}

/** Three editable lines → `DiscoverProfile.compatibility.bullets` (non-empty entries only). */
export type AlignmentBulletsTriple = [string, string, string];

export function normalizeAlignmentTriple(
  parts: readonly string[] | undefined
): AlignmentBulletsTriple {
  const p = parts ?? [];
  return [p[0] ?? "", p[1] ?? "", p[2] ?? ""];
}

export type ProfileCreationDraft = {
  alignmentBullets: AlignmentBulletsTriple;
  bio: string;
  companyName: string;
  companyNamePublic: boolean;
  degree: string;
  degreePublic: boolean;
  drinking: string;
  exercise: string;
  haveKids: HaveKidsOptionId | "";
  height: string;
  heightPublic: boolean;
  hometown: string;
  hometownPublic: boolean;
  interests: string[];
  jobTitle: string;
  jobTitlePublic: boolean;
  kids: string;
  languages: string;
  location: string;
  locationPublic: boolean;
  politics: PoliticsOptionId | "";
  preferences: ProfilePreferencesDraft;
  promptAnswer: string;
  pronouns: PronounsOptionId | "";
  religion: ReligionOptionId | "";
  schoolName: string;
  schoolNamePublic: boolean;
  smoking: string;
  zodiac: string;
};

/** Basics fields edited in profile creation / `PATCH /v1/users/me/profile`. */
export type ProfileBasicsDraftSlice = Pick<
  ProfileCreationDraft,
  | "jobTitle"
  | "jobTitlePublic"
  | "companyName"
  | "companyNamePublic"
  | "degree"
  | "degreePublic"
  | "schoolName"
  | "schoolNamePublic"
  | "location"
  | "locationPublic"
  | "hometown"
  | "hometownPublic"
  | "height"
  | "heightPublic"
>;

export function pickProfileBasicsDraft(
  d: ProfileCreationDraft
): ProfileBasicsDraftSlice {
  return {
    jobTitle: d.jobTitle,
    jobTitlePublic: d.jobTitlePublic,
    companyName: d.companyName,
    companyNamePublic: d.companyNamePublic,
    degree: d.degree,
    degreePublic: d.degreePublic,
    schoolName: d.schoolName,
    schoolNamePublic: d.schoolNamePublic,
    location: d.location,
    locationPublic: d.locationPublic,
    hometown: d.hometown,
    hometownPublic: d.hometownPublic,
    height: d.height,
    heightPublic: d.heightPublic,
  };
}

/**
 * Maps the basics editor slice to `PATCH /v1/users/me/profile` body fields.
 * Height is stored as digit string in the draft; the API uses centimeters as a number.
 */
export function profileBasicsDraftToPatchBody(
  d: ProfileBasicsDraftSlice
): Pick<
  PatchUserProfileBody,
  | "jobTitle"
  | "jobTitlePublic"
  | "companyName"
  | "companyNamePublic"
  | "degree"
  | "degreePublic"
  | "schoolName"
  | "schoolNamePublic"
  | "location"
  | "locationPublic"
  | "hometown"
  | "hometownPublic"
  | "height"
  | "heightPublic"
> {
  const t = (s: string) => s.trim();
  const heightTrim = d.height.trim();
  let height: number | null;
  if (heightTrim === "") {
    height = null;
  } else {
    const n = Number.parseInt(heightTrim, 10);
    height = Number.isFinite(n) ? n : null;
  }
  return {
    jobTitle: t(d.jobTitle),
    jobTitlePublic: d.jobTitlePublic,
    companyName: t(d.companyName),
    companyNamePublic: d.companyNamePublic,
    degree: d.degree.trim() === "" ? "" : d.degree,
    degreePublic: d.degreePublic,
    schoolName: t(d.schoolName),
    schoolNamePublic: d.schoolNamePublic,
    location: t(d.location),
    locationPublic: d.locationPublic,
    hometown: t(d.hometown),
    hometownPublic: d.hometownPublic,
    height,
    heightPublic: d.heightPublic,
  };
}

/** Stored on draft; labels come from `strings.profile.profileCreation.seekingLabels`. */
export const SEEKING_VALUES = ["Men", "Women", "Nonbinary"] as const;

export const INTEREST_IDS = [
  "reads",
  "coffee",
  "hiking",
  "cooking",
  "music_live",
  "travel_slow",
  "therapy_positive",
  "early_riser",
] as const;

export type InterestId = (typeof INTEREST_IDS)[number];

export const EXERCISE_VALUES = ["often", "sometimes", "rarely"] as const;

export const DRINKING_VALUES = ["yes_social", "sometimes", "no"] as const;

export const SMOKING_VALUES = ["no", "sometimes", "yes"] as const;

export const ZODIAC_VALUES = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
] as const;

/** Re-export for profile creation selects — labels in `strings.profile.profileCreation.selectOptions`. */
export {HAVE_KIDS_OPTION_IDS as HAVE_KIDS_VALUES} from "@/types";
export {POLITICS_OPTION_IDS as POLITICS_VALUES} from "@/types";
export {RELIGION_OPTION_IDS as RELIGION_VALUES} from "@/types";
export {PRONOUNS_OPTION_IDS as PRONOUNS_VALUES} from "@/types";

/**
 * Profile creation languages — multi-select (max 3). Stable `value` keys; draft stores
 * comma-separated **labels** for readable copy on discover and detailed profile.
 */
export const PROFILE_CREATION_LANGUAGE_OPTIONS = [
  {label: "English", value: "english"},
  {label: "Hindi", value: "hindi"},
  {label: "Tamil", value: "tamil"},
  {label: "Telugu", value: "telugu"},
  {label: "Marathi", value: "marathi"},
  {label: "Bengali", value: "bengali"},
  {label: "Gujarati", value: "gujarati"},
  {label: "Kannada", value: "kannada"},
  {label: "Malayalam", value: "malayalam"},
  {label: "Punjabi", value: "punjabi"},
  {label: "Odia", value: "odia"},
  {label: "Urdu", value: "urdu"},
  {label: "Assamese", value: "assamese"},
  {label: "Konkani", value: "konkani"},
  {label: "Sanskrit", value: "sanskrit"},
  {label: "Spanish", value: "spanish"},
  {label: "French", value: "french"},
  {label: "German", value: "german"},
  {label: "Italian", value: "italian"},
  {label: "Portuguese", value: "portuguese"},
  {label: "Mandarin Chinese", value: "mandarin"},
  {label: "Cantonese", value: "cantonese"},
  {label: "Japanese", value: "japanese"},
  {label: "Korean", value: "korean"},
  {label: "Arabic", value: "arabic"},
  {label: "Russian", value: "russian"},
  {label: "Dutch", value: "dutch"},
  {label: "Turkish", value: "turkish"},
  {label: "Persian (Farsi)", value: "persian"},
  {label: "Vietnamese", value: "vietnamese"},
  {label: "Thai", value: "thai"},
  {label: "Indonesian", value: "indonesian"},
  {label: "Swahili", value: "swahili"},
  {label: "Polish", value: "polish"},
  {label: "Ukrainian", value: "ukrainian"},
] as const;

/** Keys for degree; labels in `strings.profile.profileCreation.selectOptions.degree`. */
export const DEGREE_VALUES = [
  "high_school",
  "some_college",
  "associate",
  "bachelors",
  "masters",
  "doctorate",
  "professional",
  "trade_cert",
  "others",
] as const;

const BIO_MIN = 28;
const PROMPT_MIN = 16;
const MIN_PHOTOS = 2;
const RICH_PHOTO_COUNT = 6;
export const PROFILE_CREATION_MIN_INTERESTS = 2;
const INTENTIONS_MIN = 12;

export type CompletionSlot = {
  filled: boolean;
  id: string;
  /** 0–1 weight toward the score */
  weight: number;
};

export function buildDraftFromUser(
  user: CurrentUserProfile
): ProfileCreationDraft {
  return {
    alignmentBullets: normalizeAlignmentTriple(user.alignmentBullets),
    bio: user.bio,
    preferences: {
      seeking: [...user.preferences.seeking],
      ageMin: user.preferences.ageRange.min,
      ageMax: user.preferences.ageRange.max,
      ageRangeStrict: user.preferences.ageRangeStrict ?? false,
      distanceKm: user.preferences.distanceKm,
      intentions: user.preferences.intentions,
    },
    jobTitle: user.jobTitle ?? "",
    jobTitlePublic: user.jobTitlePublic !== false,
    companyName: user.companyName ?? "",
    companyNamePublic: user.companyNamePublic !== false,
    degree: user.degree ?? "",
    degreePublic: user.degreePublic !== false,
    schoolName: user.schoolName ?? "",
    schoolNamePublic: user.schoolNamePublic !== false,
    location: user.location ?? "",
    locationPublic: user.locationPublic !== false,
    hometown: user.hometown ?? "",
    hometownPublic: user.hometownPublic !== false,
    height: user.height ?? "",
    heightPublic: user.heightPublic !== false,
    exercise: "",
    drinking: "",
    smoking: "",
    kids: "",
    haveKids: "",
    politics: "",
    religion: "",
    pronouns: "",
    languages: "",
    zodiac: "",
    interests: [...(user.interests ?? [])],
    promptAnswer: "",
  };
}

export type ProfileCompletionContext = {
  photoCount: number;
  verification: CurrentUserProfile["verification"];
};

export function computeProfileCreationCompletion(
  draft: ProfileCreationDraft,
  ctx: ProfileCompletionContext
): {percent: number; slots: CompletionSlot[]} {
  const {photoCount, verification} = ctx;
  const pref = draft.preferences;
  const ageOk =
    pref.ageMin >= 18 && pref.ageMax <= 99 && pref.ageMin < pref.ageMax;
  const distanceOk = pref.distanceKm >= 0 && pref.distanceKm <= 500;

  const slots: CompletionSlot[] = [
    {
      id: "bio",
      weight: 1,
      filled: draft.bio.trim().length >= BIO_MIN,
    },
    {id: "photos", weight: 1, filled: photoCount >= MIN_PHOTOS},
    {
      id: "photosRich",
      weight: 0.75,
      filled: photoCount >= RICH_PHOTO_COUNT,
    },
    {
      id: "pref_seeking",
      weight: 1,
      filled: pref.seeking.length > 0,
    },
    {id: "pref_age", weight: 1, filled: ageOk},
    {id: "pref_distance", weight: 0.85, filled: distanceOk},
    {
      id: "pref_intentions",
      weight: 1,
      filled: pref.intentions.trim().length >= INTENTIONS_MIN,
    },
    {
      id: "verify_phone",
      weight: 0.9,
      filled: verification.phone,
    },
    {
      id: "verify_photo",
      weight: 0.95,
      filled: verification.photo,
    },
    {id: "verify_id", weight: 1.1, filled: verification.id},
    {
      id: "jobTitle",
      weight: 0.5,
      filled: draft.jobTitle.trim().length > 0,
    },
    {
      id: "companyName",
      weight: 0.5,
      filled: draft.companyName.trim().length > 0,
    },
    {id: "degree", weight: 0.5, filled: draft.degree.trim().length > 0},
    {
      id: "schoolName",
      weight: 0.5,
      filled: draft.schoolName.trim().length > 0,
    },
    {id: "location", weight: 1, filled: draft.location.trim().length > 0},
    {id: "hometown", weight: 0.6, filled: draft.hometown.trim().length > 0},
    {id: "height", weight: 0.7, filled: draft.height.trim().length > 0},
    {id: "exercise", weight: 0.7, filled: draft.exercise.length > 0},
    {id: "drinking", weight: 0.7, filled: draft.drinking.length > 0},
    {id: "smoking", weight: 0.7, filled: draft.smoking.length > 0},
    {id: "kids", weight: 0.6, filled: draft.kids.trim().length > 0},
    {id: "haveKids", weight: 0.6, filled: draft.haveKids.trim().length > 0},
    {id: "politics", weight: 0.6, filled: draft.politics.trim().length > 0},
    {id: "religion", weight: 0.6, filled: draft.religion.trim().length > 0},
    {id: "pronouns", weight: 0.7, filled: draft.pronouns.trim().length > 0},
    {id: "languages", weight: 0.7, filled: draft.languages.trim().length > 0},
    {id: "zodiac", weight: 0.5, filled: draft.zodiac.length > 0},
    {
      id: "interests",
      weight: 1,
      filled: draft.interests.length >= PROFILE_CREATION_MIN_INTERESTS,
    },
    {
      id: "prompt",
      weight: 0.8,
      filled: draft.promptAnswer.trim().length >= PROMPT_MIN,
    },
    {
      id: "alignment",
      weight: 0.75,
      filled:
        draft.alignmentBullets.filter((b) => b.trim().length > 0).length >= 2,
    },
  ];

  const total = slots.reduce((s, x) => s + x.weight, 0);
  const done = slots.reduce((s, x) => s + (x.filled ? x.weight : 0), 0);
  const percent =
    total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;

  return {percent, slots};
}
