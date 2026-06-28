import {sql} from "drizzle-orm";
import {
  boolean,
  customType,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import type {
  ProfileDegree,
  UserLocationJson,
} from "../modules/userProfile/matchPreferences.js";

/** Binary object in Postgres; null when bytes live in local disk or S3. */
const userPhotoObjectData = customType<{
  data: Buffer;
  driverData: Buffer;
}>({
  dataType: () => "bytea",
  fromDriver: (value) => value as Buffer,
  toDriver: (value) => value,
});

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    phoneE164: text("phone_e164"),
    googleSub: text("google_sub"),
    email: text("email"),
    bio: text("bio"),
    displayName: text("display_name"),
    lastName: text("last_name"),
    dateOfBirth: date("date_of_birth", {mode: "string"}),
    gender: text("gender"),
    jobTitle: text("job_title"),
    companyName: text("company_name"),
    degree: text("degree").$type<ProfileDegree | null>(),
    schoolName: text("school_name"),
    hometown: text("hometown"),
    /** Height in centimeters; null when unset. */
    heightCm: integer("height_cm"),
    /** When false, hide `jobTitle` on public discover views (stored value unchanged). Default true. */
    jobTitlePublic: boolean("job_title_public").notNull().default(true),
    companyNamePublic: boolean("company_name_public").notNull().default(true),
    degreePublic: boolean("degree_public").notNull().default(true),
    schoolNamePublic: boolean("school_name_public").notNull().default(true),
    locationPublic: boolean("location_public").notNull().default(true),
    hometownPublic: boolean("hometown_public").notNull().default(true),
    heightPublic: boolean("height_public").notNull().default(true),
    /**
     * Legacy public-facing label string. Prefer syncing with `userLocation.label` when present.
     */
    location: text("location"),
    userLocation: jsonb("user_location").$type<UserLocationJson | null>(),
    /** Profile interest catalog ids (order preserved; max enforced in API). */
    interests: text("interests")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    createdAt: timestamp("created_at", {withTimezone: true})
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", {withTimezone: true})
      .notNull()
      .defaultNow(),
    lastLoginAt: timestamp("last_login_at", {withTimezone: true}),
  },
  (table) => ({
    phoneUnique: uniqueIndex("users_phone_e164_unique").on(table.phoneE164),
    googleUnique: uniqueIndex("users_google_sub_unique").on(table.googleSub),
  })
);

export const refreshTokens = pgTable(
  "refresh_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {onDelete: "cascade"}),
    lookupHash: text("lookup_hash").notNull(),
    hashedToken: text("hashed_token").notNull(),
    expiresAt: timestamp("expires_at", {withTimezone: true}).notNull(),
    revokedAt: timestamp("revoked_at", {withTimezone: true}),
    replacedByTokenId: uuid("replaced_by_token_id"),
    userAgent: text("user_agent"),
    ip: text("ip"),
    createdAt: timestamp("created_at", {withTimezone: true})
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    lookupUnique: uniqueIndex("refresh_tokens_lookup_hash_unique").on(
      table.lookupHash
    ),
    userIdx: index("refresh_tokens_user_id_idx").on(table.userId),
    expiresIdx: index("refresh_tokens_expires_at_idx").on(table.expiresAt),
  })
);

export const oauthAccounts = pgTable(
  "oauth_accounts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {onDelete: "cascade"}),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    createdAt: timestamp("created_at", {withTimezone: true})
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    providerUnique: uniqueIndex("oauth_accounts_provider_unique").on(
      table.provider,
      table.providerAccountId
    ),
  })
);

export const authAuditLogs = pgTable(
  "auth_audit_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, {onDelete: "set null"}),
    eventType: text("event_type").notNull(),
    ip: text("ip"),
    userAgent: text("user_agent"),
    meta: jsonb("meta").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", {withTimezone: true})
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    userIdx: index("auth_audit_logs_user_id_idx").on(table.userId),
    createdIdx: index("auth_audit_logs_created_at_idx").on(table.createdAt),
  })
);

export const userPhotos = pgTable(
  "user_photos",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {onDelete: "cascade"}),
    storageKey: text("storage_key").notNull(),
    /** Set when `USER_PHOTOS_STORAGE=postgres`; otherwise bytes are in local dir or S3. */
    objectData: userPhotoObjectData("object_data"),
    objectContentType: text("object_content_type"),
    sortOrder: integer("sort_order").notNull().default(0),
    alt: text("alt"),
    blurDataUrl: text("blur_data_url"),
    createdAt: timestamp("created_at", {withTimezone: true})
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    userIdx: index("user_photos_user_id_idx").on(table.userId),
    userSortIdx: index("user_photos_user_id_sort_order_idx").on(
      table.userId,
      table.sortOrder
    ),
  })
);

/** Who-I’m-looking-for; one row per user (created on first PATCH of preferences). */
export const userMatchPreferences = pgTable("user_match_preferences", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, {onDelete: "cascade"}),
  ageRangeStrict: boolean("age_range_strict").notNull().default(false),
  ageMax: integer("age_max").notNull().default(99),
  ageMin: integer("age_min").notNull().default(18),
  distanceKm: integer("distance_km").notNull().default(50),
  seeking: text("seeking")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  intentions: text("intentions").notNull().default(""),
  updatedAt: timestamp("updated_at", {withTimezone: true})
    .notNull()
    .defaultNow(),
});
