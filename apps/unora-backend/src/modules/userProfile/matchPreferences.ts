import {z} from "zod";

/** Max number of interest catalog ids per profile (align with client picker). */
export const MAX_PROFILE_INTERESTS = 20;

export const profileInterestIdSchema = z
  .string()
  .min(1, "interest id must not be empty")
  .max(128, "interest id is too long");

/**
 * Normalizes to unique ids (first occurrence wins) for canonical storage/response.
 */
export const profileInterestsArraySchema = z
  .array(profileInterestIdSchema)
  .max(
    MAX_PROFILE_INTERESTS,
    `at most ${String(MAX_PROFILE_INTERESTS)} interests allowed`
  )
  .transform((arr) => Array.from(new Set(arr)) as string[]);

export const matchSeekingValues = ["Men", "Women", "Nonbinary"] as const;
export const profileGenderValues = [
  "woman",
  "man",
  "nonbinary",
  "prefer_not_say",
] as const;

/** Align with Unora frontend `DEGREE_VALUES` / `PatchUserProfileBody`. */
export const profileDegreeValues = [
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

const seekingItemSchema = z.enum(matchSeekingValues);
const profileGenderSchema = z.enum(profileGenderValues);
const profileDegreeSchema = z.enum(profileDegreeValues);
/** Frontend may send `""` before user picks a value; treat like `null` (clear / unset). */
const degreePatchSchema = z.preprocess(
  (val: unknown) => {
    if (val === undefined) {
      return undefined;
    }
    if (val === null) {
      return null;
    }
    if (typeof val === "string" && val.trim() === "") {
      return null;
    }
    return val;
  },
  z.union([profileDegreeSchema, z.null()]).optional()
);
const isoDateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;

const displayNameSchema = z
  .string()
  .trim()
  .min(2, "displayName must be at least 2 characters")
  .max(60, "displayName must be at most 60 characters");

const lastNameSchema = z
  .string()
  .trim()
  .max(80, "lastName must be at most 80 characters")
  .transform((value) => (value === "" ? null : value));

const bioSchema = z
  .string()
  .trim()
  .max(2000, "bio must be at most 2000 characters")
  .transform((value) => (value === "" ? null : value));

const locationLabelSchema = z
  .string()
  .trim()
  .max(500, "location must be at most 500 characters")
  .transform((value) => (value === "" ? null : value));

const trimOptionalText = (field: string, max: number) =>
  z
    .string()
    .trim()
    .max(max, `${field} must be at most ${String(max)} characters`)
    .transform((value) => (value === "" ? null : value));

/** Height in centimeters; null clears stored height. */
const heightCmSchema = z.union([
  z
    .number()
    .int("height must be an integer")
    .min(100, "height must be at least 100 cm")
    .max(250, "height must be at most 250 cm"),
  z.null(),
]);

const userLocationObjectSchema = z
  .object({
    area: z.string().trim().max(200, "userLocation.area is too long"),
    city: z.string().trim().max(200, "userLocation.city is too long"),
    country: z
      .string()
      .trim()
      .max(120, "userLocation.country is too long")
      .refine(
        (s) => s.length > 0,
        "userLocation.country is required and must not be empty (after trimming)"
      ),
    label: z.string().trim().max(500, "userLocation.label is too long"),
    latitude: z
      .number()
      .refine(
        (n) => Number.isFinite(n),
        "userLocation.latitude must be a finite number"
      )
      .refine(
        (n) => n >= -90 && n <= 90,
        "userLocation.latitude must be between -90 and 90 (WGS-84)"
      ),
    longitude: z
      .number()
      .refine(
        (n) => Number.isFinite(n),
        "userLocation.longitude must be a finite number"
      )
      .refine(
        (n) => n >= -180 && n <= 180,
        "userLocation.longitude must be between -180 and 180 (WGS-84)"
      ),
  })
  .strict();

const dateOfBirthSchema = z
  .string()
  .regex(isoDateOnlyRegex, "dateOfBirth must be in YYYY-MM-DD format")
  .refine((value) => {
    const parsed = new Date(`${value}T00:00:00.000Z`);
    return (
      !Number.isNaN(parsed.getTime()) &&
      parsed.toISOString().slice(0, 10) === value
    );
  }, "dateOfBirth must be a valid calendar date");

/**
 * JSON shape for `GET/PATCH /v1/users/me/profile` → `preferences` (aligned with unora-frontend).
 */
export const matchPreferencesSchema = z
  .object({
    ageRange: z
      .object({
        max: z.number().int().min(18).max(99),
        min: z.number().int().min(18).max(99),
      })
      .strict(),
    /** When true, min/max age is a hard filter (deal-breaker); when false/omitted, soft preference. */
    ageRangeStrict: z.boolean().default(false),
    distanceKm: z.number().int().min(1).max(500),
    intentions: z.string().max(2000),
    seeking: z
      .array(seekingItemSchema)
      .transform(
        (arr) =>
          Array.from(new Set(arr)) as Array<(typeof matchSeekingValues)[number]>
      ),
  })
  .strict()
  .superRefine((val, ctx) => {
    if (val.ageRange.min > val.ageRange.max) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "ageRange.min must be less than or equal to ageRange.max",
        path: ["ageRange"],
      });
    }
  });

/**
 * Partial PATCH: send `interests` only, `preferences` only, or both. At least one required.
 */
export const patchMyProfileBodySchema = z
  .object({
    bio: bioSchema.optional(),
    companyName: trimOptionalText("companyName", 200).optional(),
    companyNamePublic: z.boolean().optional(),
    dateOfBirth: dateOfBirthSchema.optional(),
    degree: degreePatchSchema,
    degreePublic: z.boolean().optional(),
    displayName: displayNameSchema.optional(),
    gender: profileGenderSchema.optional(),
    height: heightCmSchema.optional(),
    heightPublic: z.boolean().optional(),
    hometown: trimOptionalText("hometown", 200).optional(),
    hometownPublic: z.boolean().optional(),
    interests: profileInterestsArraySchema.optional(),
    jobTitle: trimOptionalText("jobTitle", 200).optional(),
    jobTitlePublic: z.boolean().optional(),
    lastName: lastNameSchema.optional(),
    location: locationLabelSchema.optional(),
    locationPublic: z.boolean().optional(),
    preferences: matchPreferencesSchema.optional(),
    schoolName: trimOptionalText("schoolName", 200).optional(),
    schoolNamePublic: z.boolean().optional(),
    userLocation: userLocationObjectSchema.optional(),
  })
  .strict()
  .refine(
    (b) =>
      b.interests !== undefined ||
      b.preferences !== undefined ||
      b.displayName !== undefined ||
      b.dateOfBirth !== undefined ||
      b.gender !== undefined ||
      b.lastName !== undefined ||
      b.bio !== undefined ||
      b.location !== undefined ||
      b.userLocation !== undefined ||
      b.jobTitle !== undefined ||
      b.companyName !== undefined ||
      b.degree !== undefined ||
      b.schoolName !== undefined ||
      b.hometown !== undefined ||
      b.height !== undefined ||
      b.jobTitlePublic !== undefined ||
      b.companyNamePublic !== undefined ||
      b.degreePublic !== undefined ||
      b.schoolNamePublic !== undefined ||
      b.locationPublic !== undefined ||
      b.hometownPublic !== undefined ||
      b.heightPublic !== undefined,
    {
      message:
        "Provide at least one of: interests, preferences, displayName, dateOfBirth, gender, lastName, bio, location, userLocation, jobTitle, companyName, degree, schoolName, hometown, height, jobTitlePublic, companyNamePublic, degreePublic, schoolNamePublic, locationPublic, hometownPublic, heightPublic",
    }
  )
  .transform((b) => {
    if (b.userLocation === undefined) {
      return b;
    }

    const {area, city, country, label, latitude, longitude} = b.userLocation;
    const areaCityCountryLabel = [area, city, country]
      .filter((part) => part.length > 0)
      .join(", ");

    const hasExplicitUserLocationLabel = label.length > 0;
    const legacyLocation =
      typeof b.location === "string" ? b.location : undefined;
    const hasLegacyLocation = legacyLocation !== undefined;
    // Precedence: explicit `userLocation.label` wins when provided; else legacy `location` string; else a formatted area/city/country label.
    const effectiveLabel = hasExplicitUserLocationLabel
      ? label
      : hasLegacyLocation
        ? legacyLocation
        : areaCityCountryLabel;

    return {
      ...b,
      // Keep the legacy public label aligned to the same effective string when structured location is present.
      location: effectiveLabel,
      userLocation: {
        area,
        city,
        country,
        label: effectiveLabel,
        latitude,
        longitude,
      },
    };
  });

export type MatchPreferencesJson = z.infer<typeof matchPreferencesSchema>;
export type ProfileGender = z.infer<typeof profileGenderSchema>;
export type ProfileDegree = z.infer<typeof profileDegreeSchema>;
export type UserLocationJson = z.infer<typeof userLocationObjectSchema>;

export const defaultMatchPreferencesJson: MatchPreferencesJson = {
  ageRange: {max: 99, min: 18},
  ageRangeStrict: false,
  distanceKm: 50,
  intentions: "",
  seeking: [],
};
