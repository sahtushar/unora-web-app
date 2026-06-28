import {describe, expect, it} from "vitest";

import {
  matchPreferencesSchema,
  patchMyProfileBodySchema,
  profileInterestsArraySchema,
} from "../src/modules/userProfile/matchPreferences.js";

const validPreferences = {
  ageRange: {max: 35, min: 25},
  ageRangeStrict: true,
  distanceKm: 100,
  intentions: "Serious",
  seeking: ["Women", "Nonbinary"] as const,
};

describe("matchPreferencesSchema", () => {
  it("accepts valid full payload", () => {
    const r = matchPreferencesSchema.safeParse(validPreferences);
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.seeking).toEqual(["Women", "Nonbinary"]);
      expect(r.data.ageRangeStrict).toBe(true);
    }
  });

  it("defaults ageRangeStrict to false when omitted", () => {
    const {ageRangeStrict: _a, ...withoutStrict} = validPreferences;
    const r = matchPreferencesSchema.safeParse(withoutStrict);
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.ageRangeStrict).toBe(false);
    }
  });

  it("deduplicates seeking", () => {
    const r = matchPreferencesSchema.safeParse({
      ...validPreferences,
      seeking: ["Men", "Men", "Women"],
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.seeking).toEqual(["Men", "Women"]);
    }
  });

  it("rejects min > max in ageRange", () => {
    const r = matchPreferencesSchema.safeParse({
      ...validPreferences,
      ageRange: {max: 20, min: 40},
    });
    expect(r.success).toBe(false);
  });

  it("rejects age under 18", () => {
    const r = matchPreferencesSchema.safeParse({
      ...validPreferences,
      ageRange: {max: 30, min: 17},
    });
    expect(r.success).toBe(false);
  });

  it("rejects distance out of 1-500", () => {
    expect(
      matchPreferencesSchema.safeParse({...validPreferences, distanceKm: 0}).success,
    ).toBe(false);
    expect(
      matchPreferencesSchema.safeParse({...validPreferences, distanceKm: 501}).success,
    ).toBe(false);
  });

  it("rejects invalid seeking value", () => {
    const r = matchPreferencesSchema.safeParse({
      ...validPreferences,
      seeking: ["Invalid"],
    });
    expect(r.success).toBe(false);
  });
});

describe("patchMyProfileBodySchema", () => {
  const userLocationPune = {
    area: "Hinjawadi",
    city: "Pune",
    country: "India",
    label: "Hinjawadi, Pune",
    latitude: 18.59,
    longitude: 73.73,
  };

  it("accepts profile basics only", () => {
    const r = patchMyProfileBodySchema.safeParse({
      dateOfBirth: "1998-07-15",
      displayName: "Tusha",
      gender: "woman",
    });
    expect(r.success).toBe(true);
  });

  it("accepts each new field individually", () => {
    expect(
      patchMyProfileBodySchema.safeParse({displayName: "Tusha"}).success
    ).toBe(true);
    expect(
      patchMyProfileBodySchema.safeParse({dateOfBirth: "1998-07-15"}).success
    ).toBe(true);
    expect(patchMyProfileBodySchema.safeParse({gender: "man"}).success).toBe(
      true
    );
    expect(
      patchMyProfileBodySchema.safeParse({lastName: "Patel"}).success
    ).toBe(true);
  });

  it("accepts empty lastName as clear and normalizes to null", () => {
    const r = patchMyProfileBodySchema.safeParse({lastName: "   "});
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.lastName).toBeNull();
    }
  });

  it("rejects lastName above max length", () => {
    const longValue = "a".repeat(81);
    expect(patchMyProfileBodySchema.safeParse({lastName: longValue}).success).toBe(
      false
    );
  });

  it("accepts `userLocation` only and derives legacy `location` for storage", () => {
    const r = patchMyProfileBodySchema.parse({
      userLocation: {
        area: "Hinjawadi",
        city: "Pune",
        country: "India",
        label: "",
        latitude: 18.59,
        longitude: 73.73,
      },
    });
    expect(r.userLocation).toBeDefined();
    if (r.userLocation) {
      expect(r.userLocation.label).toBe("Hinjawadi, Pune, India");
    }
    expect(r.location).toBe("Hinjawadi, Pune, India");
  });

  it("prefers `userLocation.label` over `location` when both are present (canonicalizes legacy `location`)", () => {
    const r = patchMyProfileBodySchema.parse({
      location: "Wrong",
      userLocation: userLocationPune,
    });
    expect(r.location).toBe("Hinjawadi, Pune");
    if (r.userLocation) {
      expect(r.userLocation.label).toBe("Hinjawadi, Pune");
    }
  });

  it("rejects invalid `userLocation` (non-finite lat/lon)", () => {
    expect(
      patchMyProfileBodySchema.safeParse({
        userLocation: {
          area: "Hinjawadi",
          city: "Pune",
          country: "India",
          label: "Hinjawadi, Pune",
          latitude: Number.NaN,
          longitude: 73.73,
        },
      }).success
    ).toBe(false);
  });

  it("rejects empty/whitespace `userLocation.country`", () => {
    expect(
      patchMyProfileBodySchema.safeParse({
        userLocation: {
          area: "Hinjawadi",
          city: "Pune",
          country: "  ",
          label: "Hinjawadi, Pune",
          latitude: 18.59,
          longitude: 73.73,
        },
      }).success
    ).toBe(false);
  });

  it("accepts preferences only", () => {
    const r = patchMyProfileBodySchema.safeParse({preferences: validPreferences});
    expect(r.success).toBe(true);
  });

  it("accepts interests only", () => {
    const r = patchMyProfileBodySchema.safeParse({interests: ["a", "b"]});
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.interests).toEqual(["a", "b"]);
    }
  });

  it("accepts both interests and preferences", () => {
    const r = patchMyProfileBodySchema.safeParse({
      interests: ["x"],
      preferences: validPreferences,
    });
    expect(r.success).toBe(true);
  });

  it("rejects empty body", () => {
    const r = patchMyProfileBodySchema.safeParse({});
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues[0]?.message).toContain("Provide at least one of");
    }
  });

  it("rejects invalid gender", () => {
    const r = patchMyProfileBodySchema.safeParse({gender: "other"});
    expect(r.success).toBe(false);
  });

  it("rejects invalid dateOfBirth format", () => {
    expect(
      patchMyProfileBodySchema.safeParse({dateOfBirth: "15-07-1998"}).success
    ).toBe(false);
    expect(
      patchMyProfileBodySchema.safeParse({dateOfBirth: "1998-02-31"}).success
    ).toBe(false);
  });

  it("accepts bio only", () => {
    expect(
      patchMyProfileBodySchema.safeParse({bio: "Hello there"}).success
    ).toBe(true);
  });

  it("accepts empty bio as clear and normalizes to null", () => {
    const r = patchMyProfileBodySchema.safeParse({bio: "   "});
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.bio).toBeNull();
    }
  });

  it("accepts work/education basics fields and height null", () => {
    const r = patchMyProfileBodySchema.safeParse({
      companyName: "Acme",
      degree: "masters",
      height: null,
      hometown: "Indore",
      jobTitle: "Engineer",
      schoolName: "MIT",
    });
    expect(r.success).toBe(true);
  });

  it("accepts jobTitle only for minimum-fields gate", () => {
    expect(patchMyProfileBodySchema.safeParse({jobTitle: "PM"}).success).toBe(
      true
    );
  });

  it("accepts only basics visibility flags for minimum-fields gate", () => {
    expect(
      patchMyProfileBodySchema.safeParse({jobTitlePublic: false}).success,
    ).toBe(true);
  });

  it("rejects invalid degree", () => {
    expect(
      patchMyProfileBodySchema.safeParse({degree: "phd"}).success
    ).toBe(false);
  });

  it("normalizes empty degree string to null (frontend draft)", () => {
    const r = patchMyProfileBodySchema.safeParse({
      degree: "",
      jobTitle: "S",
      location: "Hinjawadi, Pune",
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.degree).toBeNull();
    }
  });

  it("rejects height out of plausible range", () => {
    expect(patchMyProfileBodySchema.safeParse({height: 99}).success).toBe(
      false
    );
    expect(patchMyProfileBodySchema.safeParse({height: 251}).success).toBe(
      false
    );
  });

  it("rejects extra top-level keys", () => {
    const r = patchMyProfileBodySchema.safeParse({extra: 1, preferences: validPreferences});
    expect(r.success).toBe(false);
  });
});

describe("profileInterestsArraySchema", () => {
  it("deduplicates while preserving first occurrence order", () => {
    const r = profileInterestsArraySchema.safeParse(["z", "a", "z", "a"]);
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data).toEqual(["z", "a"]);
    }
  });
});
