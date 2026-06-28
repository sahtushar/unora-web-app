/**
 * OpenAPI document for Swagger UI only. Route validation uses Zod in handlers.
 * On a future HTTP framework migration, regenerate or relocate this alongside the new adapter.
 */
export const openApiDocument = {
  components: {
    schemas: {
      CurrentUser: {
        additionalProperties: false,
        properties: {
          createdAt: {format: "date-time", type: "string"},
          email: {nullable: true, type: "string"},
          googleSub: {nullable: true, type: "string"},
          id: {format: "uuid", type: "string"},
          lastLoginAt: {format: "date-time", nullable: true, type: "string"},
          phoneE164: {nullable: true, type: "string"},
          photos: {
            items: {$ref: "#/components/schemas/UserPhoto"},
            type: "array",
          },
          updatedAt: {format: "date-time", type: "string"},
        },
        required: ["id", "createdAt", "updatedAt", "lastLoginAt", "photos"],
        type: "object",
      },
      UserPhoto: {
        additionalProperties: false,
        properties: {
          alt: {type: "string"},
          blurDataUrl: {type: "string"},
          id: {format: "uuid", type: "string"},
          url: {format: "uri", type: "string"},
        },
        required: ["id", "url"],
        type: "object",
      },
      MatchPreferences: {
        additionalProperties: false,
        properties: {
          ageRange: {$ref: "#/components/schemas/MatchPreferencesAgeRange"},
          ageRangeStrict: {
            default: false,
            description:
              "When true, age min/max is a hard filter; when false, a soft preference. Omit in PATCH to keep prior default (false).",
            type: "boolean",
          },
          distanceKm: {maximum: 500, minimum: 1, type: "integer"},
          intentions: {type: "string"},
          seeking: {
            items: {enum: ["Men", "Women", "Nonbinary"], type: "string"},
            type: "array",
          },
        },
        required: [
          "ageRange",
          "ageRangeStrict",
          "distanceKm",
          "intentions",
          "seeking",
        ],
        type: "object",
      },
      MatchPreferencesAgeRange: {
        additionalProperties: false,
        properties: {
          max: {maximum: 99, minimum: 18, type: "integer"},
          min: {maximum: 99, minimum: 18, type: "integer"},
        },
        required: ["min", "max"],
        type: "object",
      },
      ProfileGender: {
        enum: ["woman", "man", "nonbinary", "prefer_not_say"],
        type: "string",
      },
      ProfileDegree: {
        enum: [
          "high_school",
          "some_college",
          "associate",
          "bachelors",
          "masters",
          "doctorate",
          "professional",
          "trade_cert",
          "others",
        ],
        type: "string",
      },
      UserLocation: {
        additionalProperties: false,
        description:
          "Structured user location. When both `location` and `userLocation` are present, the server prefers `userLocation.label` (after trimming) for the canonical public label string in `location`.",
        properties: {
          area: {type: "string"},
          city: {type: "string"},
          country: {minLength: 1, type: "string"},
          label: {type: "string"},
          latitude: {maximum: 90, minimum: -90, type: "number"},
          longitude: {maximum: 180, minimum: -180, type: "number"},
        },
        required: ["label", "latitude", "longitude", "area", "city", "country"],
        type: "object",
      },
      ProfilePatchRequest: {
        additionalProperties: false,
        description:
          "Partial update: include one or more profile fields (`jobTitle`, `companyName`, `degree`, `schoolName`, `location`, `hometown`, `height`, `userLocation`, `displayName`, `dateOfBirth`, `gender`, `lastName`, `bio`, `interests`, `preferences`, and optional `*Public` booleans for discover visibility). Omitted fields are unchanged. When `userLocation` is sent, the server will keep the legacy `location` string in sync (derived from `userLocation.label` when the label is omitted). `height` is centimeters (100–250) or null to clear. Each `*Public` flag defaults to true (visible on discover); `false` hides that value on public surfaces while keeping it for the signed-in owner.",
        properties: {
          companyName: {
            description: "Employer name; empty string clears.",
            maxLength: 200,
            type: "string",
          },
          companyNamePublic: {
            description:
              "When false, `companyName` is omitted on public discover cards; owner still sees the value on `GET /v1/users/me/profile`.",
            type: "boolean",
          },
          bio: {
            description:
              "Optional bio text. Empty string is allowed and treated as cleared.",
            maxLength: 2000,
            type: "string",
          },
          dateOfBirth: {
            description: "Birth date in YYYY-MM-DD format.",
            format: "date",
            type: "string",
          },
          degree: {
            allOf: [{$ref: "#/components/schemas/ProfileDegree"}],
            description: "Education level key; null clears stored degree.",
            nullable: true,
          },
          degreePublic: {
            description: "When false, `degree` is hidden on public discover cards.",
            type: "boolean",
          },
          displayName: {
            description: "Public display name shown on profile.",
            maxLength: 60,
            minLength: 2,
            type: "string",
          },
          gender: {$ref: "#/components/schemas/ProfileGender"},
          height: {
            description: "Height in centimeters (100–250), or null to clear.",
            maximum: 250,
            minimum: 100,
            nullable: true,
            type: "integer",
          },
          heightPublic: {
            description: "When false, `height` is hidden on public discover cards.",
            type: "boolean",
          },
          hometown: {
            description: "Hometown label; empty string clears.",
            maxLength: 200,
            type: "string",
          },
          hometownPublic: {
            description: "When false, `hometown` is hidden on public discover cards.",
            type: "boolean",
          },
          jobTitle: {
            description: "Job title; empty string clears.",
            maxLength: 200,
            type: "string",
          },
          jobTitlePublic: {
            description: "When false, `jobTitle` is hidden on public discover cards.",
            type: "boolean",
          },
          lastName: {
            description:
              "Optional last name. Empty string is allowed and treated as cleared.",
            maxLength: 80,
            type: "string",
          },
          location: {
            description:
              "Legacy public-facing label string (neighborhood / city / etc.).",
            type: "string",
          },
          locationPublic: {
            description:
              "When false, `location` and structured `userLocation` are hidden on public discover cards.",
            type: "boolean",
          },
          schoolName: {
            description: "School or university name; empty string clears.",
            maxLength: 200,
            type: "string",
          },
          schoolNamePublic: {
            description: "When false, `schoolName` is hidden on public discover cards.",
            type: "boolean",
          },
          userLocation: {$ref: "#/components/schemas/UserLocation"},
          interests: {
            description:
              "Catalog ids from the app interest picker (order preserved, duplicates removed server-side, max 20).",
            items: {type: "string"},
            type: "array",
          },
          preferences: {$ref: "#/components/schemas/MatchPreferences"},
        },
        type: "object",
      },
      UserProfile: {
        additionalProperties: false,
        properties: {
          bio: {nullable: true, type: "string"},
          companyName: {nullable: true, type: "string"},
          companyNamePublic: {
            description:
              "Discover visibility for `companyName` (false = hidden on public cards).",
            type: "boolean",
          },
          dateOfBirth: {
            format: "date",
            nullable: true,
            type: "string",
          },
          degree: {
            allOf: [{$ref: "#/components/schemas/ProfileDegree"}],
            nullable: true,
          },
          degreePublic: {
            description: "Discover visibility for `degree`.",
            type: "boolean",
          },
          displayName: {nullable: true, type: "string"},
          gender: {
            allOf: [{$ref: "#/components/schemas/ProfileGender"}],
            nullable: true,
          },
          height: {nullable: true, type: "integer"},
          heightPublic: {
            description: "Discover visibility for `height`.",
            type: "boolean",
          },
          hometown: {nullable: true, type: "string"},
          hometownPublic: {
            description: "Discover visibility for `hometown`.",
            type: "boolean",
          },
          jobTitle: {nullable: true, type: "string"},
          jobTitlePublic: {
            description: "Discover visibility for `jobTitle`.",
            type: "boolean",
          },
          lastName: {nullable: true, type: "string"},
          location: {nullable: true, type: "string"},
          locationPublic: {
            description: "Discover visibility for `location` / `userLocation`.",
            type: "boolean",
          },
          schoolName: {nullable: true, type: "string"},
          schoolNamePublic: {
            description: "Discover visibility for `schoolName`.",
            type: "boolean",
          },
          userLocation: {
            allOf: [{$ref: "#/components/schemas/UserLocation"}],
            nullable: true,
          },
          interests: {
            description:
              "Selected interest catalog ids in canonical order (empty if none).",
            items: {type: "string"},
            type: "array",
          },
          photos: {
            items: {$ref: "#/components/schemas/UserProfilePhoto"},
            type: "array",
          },
          preferences: {$ref: "#/components/schemas/MatchPreferences"},
        },
        required: [
          "bio",
          "companyName",
          "companyNamePublic",
          "degree",
          "degreePublic",
          "displayName",
          "dateOfBirth",
          "gender",
          "height",
          "heightPublic",
          "hometown",
          "hometownPublic",
          "jobTitle",
          "jobTitlePublic",
          "lastName",
          "location",
          "locationPublic",
          "schoolName",
          "schoolNamePublic",
          "userLocation",
          "interests",
          "photos",
          "preferences",
        ],
        type: "object",
      },
      UserProfilePhoto: {
        additionalProperties: false,
        properties: {
          alt: {type: "string"},
          id: {format: "uuid", type: "string"},
          url: {format: "uri", type: "string"},
          blurDataUrl: {type: "string"},
        },
        required: ["alt", "id", "url"],
        type: "object",
      },
    },
    securitySchemes: {
      bearerAuth: {
        bearerFormat: "JWT",
        scheme: "bearer",
        type: "http",
      },
    },
  },
  info: {title: "Unora API", version: "1.0.0"},
  openapi: "3.1.0",
  paths: {
    "/health": {
      get: {
        responses: {"200": {description: "Service is up"}},
        summary: "Health check",
      },
    },
    "/v1/auth/google": {
      post: {
        requestBody: {
          content: {
            "application/json": {
              schema: {
                properties: {idToken: {type: "string"}},
                required: ["idToken"],
                type: "object",
              },
            },
          },
          required: true,
        },
        responses: {"200": {description: "Tokens issued"}},
        summary: "Google Sign-In",
        tags: ["auth"],
      },
    },
    "/v1/auth/logout": {
      post: {
        requestBody: {
          content: {
            "application/json": {
              schema: {
                properties: {refreshToken: {type: "string"}},
                required: ["refreshToken"],
                type: "object",
              },
            },
          },
          required: true,
        },
        responses: {"200": {description: "Refresh token revoked"}},
        summary: "Logout",
        tags: ["auth"],
      },
    },
    "/v1/auth/me": {
      get: {
        responses: {
          "200": {
            content: {
              "application/json": {
                schema: {$ref: "#/components/schemas/CurrentUser"},
              },
            },
            description: "Current user (includes ordered `photos`)",
          },
        },
        security: [{bearerAuth: []}],
        summary: "Current user",
        tags: ["auth"],
      },
    },
    "/v1/auth/phone/send-otp": {
      post: {
        requestBody: {
          content: {
            "application/json": {
              schema: {
                properties: {phoneE164: {type: "string"}},
                required: ["phoneE164"],
                type: "object",
              },
            },
          },
          required: true,
        },
        responses: {
          "200": {description: "OTP sent (stub returns devOtp in development)"},
        },
        summary: "Send phone OTP",
        tags: ["auth"],
      },
    },
    "/v1/auth/phone/verify-otp": {
      post: {
        requestBody: {
          content: {
            "application/json": {
              schema: {
                properties: {
                  code: {type: "string"},
                  phoneE164: {type: "string"},
                },
                required: ["code", "phoneE164"],
                type: "object",
              },
            },
          },
          required: true,
        },
        responses: {"200": {description: "Access and refresh tokens"}},
        summary: "Verify phone OTP",
        tags: ["auth"],
      },
    },
    "/v1/auth/refresh": {
      post: {
        requestBody: {
          content: {
            "application/json": {
              schema: {
                properties: {refreshToken: {type: "string"}},
                required: ["refreshToken"],
                type: "object",
              },
            },
          },
          required: true,
        },
        responses: {"200": {description: "Rotated tokens"}},
        summary: "Refresh session",
        tags: ["auth"],
      },
    },
    "/v1/media/user-photos/{userId}/{filename}": {
      get: {
        parameters: [
          {
            in: "path",
            name: "userId",
            required: true,
            schema: {format: "uuid", type: "string"},
          },
          {
            in: "path",
            name: "filename",
            required: true,
            schema: {type: "string"},
          },
        ],
        responses: {
          "200": {
            description:
              "Image bytes (when this route is mounted: USER_PHOTOS_STORAGE=local or postgres; not used when s3 and PUBLIC_MEDIA_BASE_URL points elsewhere)",
          },
          "404": {description: "Not found"},
        },
        summary:
          "Public profile photo (served from disk or database when this API serves media)",
        tags: ["media"],
      },
    },
    "/v1/users/me/profile": {
      get: {
        responses: {
          "200": {
            content: {
              "application/json": {
                schema: {$ref: "#/components/schemas/UserProfile"},
              },
            },
            description:
              "Photos, match preferences, interest catalog ids, and location fields (legacy `location` + structured `userLocation` when available).",
          },
        },
        security: [{bearerAuth: []}],
        summary:
          "Current user profile (location, photos, preferences, interests)",
        tags: ["users"],
      },
      patch: {
        requestBody: {
          content: {
            "application/json": {
              schema: {$ref: "#/components/schemas/ProfilePatchRequest"},
            },
          },
          required: true,
        },
        responses: {
          "200": {
            content: {
              "application/json": {
                schema: {$ref: "#/components/schemas/UserProfile"},
              },
            },
            description: "Updated profile (same shape as GET)",
          },
          "400": {
            description:
              "Invalid body (e.g. empty patch, too many interests, invalid preferences, or invalid `userLocation`)",
          },
        },
        security: [{bearerAuth: []}],
        summary:
          "Patch profile: basics, `location`/`userLocation`, interests, and/or preferences (partial; at least one field)",
        tags: ["users"],
      },
    },
    "/v1/users/me/photos": {
      post: {
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                properties: {
                  file: {format: "binary", type: "string"},
                },
                required: ["file"],
                type: "object",
              },
            },
          },
          required: true,
        },
        responses: {
          "201": {
            content: {
              "application/json": {
                schema: {$ref: "#/components/schemas/UserPhoto"},
              },
            },
            description: "Photo stored",
          },
          "400": {description: "Validation error or photo limit reached"},
        },
        security: [{bearerAuth: []}],
        summary: "Upload current user profile photo",
        tags: ["users"],
      },
    },
    "/v1/users/me/photos/{photoId}": {
      delete: {
        parameters: [
          {
            in: "path",
            name: "photoId",
            required: true,
            schema: {format: "uuid", type: "string"},
          },
        ],
        responses: {
          "204": {description: "Photo removed"},
          "404": {description: "Photo not found"},
        },
        security: [{bearerAuth: []}],
        summary: "Delete current user profile photo",
        tags: ["users"],
      },
    },
  },
} as const;
