import fs from "node:fs";
import path from "node:path";

import {drizzle} from "drizzle-orm/node-postgres";
import {migrate} from "drizzle-orm/node-postgres/migrator";
import {afterAll, beforeAll, describe, expect, it} from "vitest";
import request from "supertest";

import type {Express} from "express";

import {buildApp} from "../src/app.js";
import {loadEnv} from "../src/config/env.js";
import {createDb} from "../src/db/client.js";
import {createLogger} from "../src/lib/logger.js";
import {createRedis} from "../src/redis/client.js";

function randomE164(): string {
  const n = Math.floor(10_000_000 + Math.random() * 89_999_999);
  return `+1408${String(n).slice(0, 7)}`;
}

const defaultMatchPreferences = {
  ageRange: {max: 99, min: 18},
  ageRangeStrict: false,
  distanceKm: 50,
  intentions: "",
  seeking: [] as const,
};

const emptyProfileShape = {
  bio: null,
  companyName: null,
  companyNamePublic: true,
  dateOfBirth: null,
  degree: null,
  degreePublic: true,
  displayName: null,
  gender: null,
  height: null,
  heightPublic: true,
  hometown: null,
  hometownPublic: true,
  jobTitle: null,
  jobTitlePublic: true,
  lastName: null,
  location: null,
  locationPublic: true,
  schoolName: null,
  schoolNamePublic: true,
  userLocation: null,
  interests: [] as const,
  photos: [] as const,
  preferences: defaultMatchPreferences,
};

/** Minimal valid JPEG bytes for multipart upload tests */
const tinyJpeg = Buffer.from(
  "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDAQASERYYGB8aGiYiIykqJjc5NUGChYWGx8iIiUmJyY1OUFYaGqLmqOmqbewsbGztLe4uLm6vL6/wMHCwsPHy83/wAARCAABAAEDAREAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=",
  "base64",
);

describe.skipIf(process.env["DATABASE_INTEGRATION"] !== "1")("auth happy paths", () => {
  const env = loadEnv(process.env);
  const log = createLogger(env);
  const database = createDb(env, log);
  const redis = createRedis(env, log);
  let app: Express;

  beforeAll(async () => {
    const db = drizzle(database.pool);
    await migrate(db, {migrationsFolder: path.join(process.cwd(), "drizzle")});

    fs.mkdirSync(env.USER_PHOTOS_LOCAL_DIR, {recursive: true});

    await redis.connect();
    await redis.ping();

    app = buildApp({db: database.db, env, log, redis});
  });

  afterAll(async () => {
    await redis.quit();
    await database.close();
  });

  it("send-otp returns devOtp in test env", async () => {
    const phone = randomE164();
    const res = await request(app)
      .post("/v1/auth/phone/send-otp")
      .send({phoneE164: phone})
      .expect(200);

    expect(res.body.ok).toBe(true);
    expect(typeof res.body.devOtp).toBe("string");
    expect(res.body.devOtp).toHaveLength(6);
  });

  it("verify-otp issues tokens and /me works", async () => {
    const phone = randomE164();
    const send = await request(app)
      .post("/v1/auth/phone/send-otp")
      .send({phoneE164: phone})
      .expect(200);

    const code = send.body.devOtp as string;

    const verify = await request(app)
      .post("/v1/auth/phone/verify-otp")
      .send({code, phoneE164: phone})
      .expect(200);

    expect(verify.body.accessToken).toBeTruthy();
    expect(verify.body.refreshToken).toBeTruthy();

    const me = await request(app)
      .get("/v1/auth/me")
      .set("Authorization", `Bearer ${verify.body.accessToken as string}`)
      .expect(200);

    expect(me.body.id).toBe(verify.body.userId);
    expect(me.body.phoneE164).toBe(phone);
    expect(Array.isArray(me.body.photos)).toBe(true);
    expect(me.body.photos).toHaveLength(0);

    const profile = await request(app)
      .get("/v1/users/me/profile")
      .set("Authorization", `Bearer ${verify.body.accessToken as string}`)
      .expect(200);

    expect(profile.body).toEqual(emptyProfileShape);
  });

  it("uploads a profile photo, lists it on /me, serves /v1/media, then deletes", async () => {
    const phone = randomE164();
    const send = await request(app)
      .post("/v1/auth/phone/send-otp")
      .send({phoneE164: phone})
      .expect(200);

    const verify = await request(app)
      .post("/v1/auth/phone/verify-otp")
      .send({code: send.body.devOtp as string, phoneE164: phone})
      .expect(200);

    const token = verify.body.accessToken as string;

    const uploaded = await request(app)
      .post("/v1/users/me/photos")
      .set("Authorization", `Bearer ${token}`)
      .attach("file", tinyJpeg, {contentType: "image/jpeg", filename: "p.jpg"})
      .expect(201);

    expect(typeof uploaded.body.id).toBe("string");
    expect(typeof uploaded.body.url).toBe("string");
    expect(uploaded.body.url).toMatch(/^https?:\/\//);

    const me = await request(app)
      .get("/v1/auth/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(me.body.photos).toHaveLength(1);
    expect(me.body.photos[0].id).toBe(uploaded.body.id);

    const profile = await request(app)
      .get("/v1/users/me/profile")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(profile.body).toEqual({
      ...emptyProfileShape,
      interests: [],
      photos: [{alt: "", id: uploaded.body.id, url: uploaded.body.url}],
      preferences: defaultMatchPreferences,
    });

    const u = new URL(uploaded.body.url as string);
    const mediaRes = await request(app).get(`${u.pathname}${u.search}`).expect(200);
    expect(mediaRes.headers["content-type"]).toMatch(/image\/jpeg/);

    await request(app)
      .delete(`/v1/users/me/photos/${uploaded.body.id as string}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const meAfter = await request(app)
      .get("/v1/auth/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(meAfter.body.photos).toHaveLength(0);

    const profileAfter = await request(app)
      .get("/v1/users/me/profile")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(profileAfter.body).toEqual(emptyProfileShape);
  });

  it("PATCH /me/profile then GET returns same match preferences; rejects invalid ageRange", async () => {
    const phone = randomE164();
    const send = await request(app)
      .post("/v1/auth/phone/send-otp")
      .send({phoneE164: phone})
      .expect(200);

    const verify = await request(app)
      .post("/v1/auth/phone/verify-otp")
      .send({code: send.body.devOtp as string, phoneE164: phone})
      .expect(200);

    const token = verify.body.accessToken as string;

    const saved = {
      ageRange: {max: 45, min: 28},
      ageRangeStrict: true,
      distanceKm: 80,
      intentions: "Dating",
      seeking: ["Men", "Nonbinary"] as const,
    };

    const patch = await request(app)
      .patch("/v1/users/me/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({preferences: saved})
      .expect(200);

    expect(patch.body).toEqual({
      ...emptyProfileShape,
      interests: [],
      photos: [],
      preferences: {
        ...saved,
        seeking: ["Men", "Nonbinary"],
      },
    });

    const get = await request(app)
      .get("/v1/users/me/profile")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(get.body).toEqual({
      ...emptyProfileShape,
      interests: [],
      photos: [],
      preferences: {
        ...saved,
        seeking: ["Men", "Nonbinary"],
      },
    });

    const bad = await request(app)
      .patch("/v1/users/me/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        preferences: {
          ageRange: {max: 20, min: 50},
          ageRangeStrict: false,
          distanceKm: 10,
          intentions: "",
          seeking: [],
        },
      })
      .expect(400);

    expect(bad.body.error).toBeDefined();
  });

  it("PATCH with only interests updates and returns canonical ids; empty patch is 400", async () => {
    const phone = randomE164();
    const send = await request(app)
      .post("/v1/auth/phone/send-otp")
      .send({phoneE164: phone})
      .expect(200);

    const verify = await request(app)
      .post("/v1/auth/phone/verify-otp")
      .send({code: send.body.devOtp as string, phoneE164: phone})
      .expect(200);

    const token = verify.body.accessToken as string;

    const p = await request(app)
      .patch("/v1/users/me/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({interests: ["cats", "hiking", "cats"]})
      .expect(200);

    expect(p.body.interests).toEqual(["cats", "hiking"]);
    expect(p.body.preferences).toEqual(defaultMatchPreferences);
    expect(p.body.displayName).toBeNull();
    expect(p.body.bio).toBeNull();
    expect(p.body.dateOfBirth).toBeNull();
    expect(p.body.gender).toBeNull();
    expect(p.body.lastName).toBeNull();
    expect(p.body.location).toBeNull();
    expect(p.body.userLocation).toBeNull();
    expect(p.body.jobTitle).toBeNull();
    expect(p.body.companyName).toBeNull();
    expect(p.body.degree).toBeNull();
    expect(p.body.schoolName).toBeNull();
    expect(p.body.hometown).toBeNull();
    expect(p.body.height).toBeNull();

    const g = await request(app)
      .get("/v1/users/me/profile")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(g.body.interests).toEqual(["cats", "hiking"]);

    await request(app)
      .patch("/v1/users/me/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({})
      .expect(400);
  });

  it("PATCH with profile basics succeeds, persists, and validates", async () => {
    const phone = randomE164();
    const send = await request(app)
      .post("/v1/auth/phone/send-otp")
      .send({phoneE164: phone})
      .expect(200);

    const verify = await request(app)
      .post("/v1/auth/phone/verify-otp")
      .send({code: send.body.devOtp as string, phoneE164: phone})
      .expect(200);

    const token = verify.body.accessToken as string;

    const basicsPatch = await request(app)
      .patch("/v1/users/me/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        dateOfBirth: "1998-07-15",
        displayName: "Tusha",
        gender: "woman",
        lastName: "Patel",
      })
      .expect(200);

    expect(basicsPatch.body).toEqual({
      ...emptyProfileShape,
      dateOfBirth: "1998-07-15",
      displayName: "Tusha",
      gender: "woman",
      lastName: "Patel",
      interests: [],
      photos: [],
      preferences: defaultMatchPreferences,
    });

    await request(app)
      .patch("/v1/users/me/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({lastName: "Shah"})
      .expect(200);

    await request(app)
      .patch("/v1/users/me/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({displayName: "Tushar", lastName: "Patel"})
      .expect(200);

    await request(app)
      .patch("/v1/users/me/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({lastName: ""})
      .expect(200);

    await request(app)
      .patch("/v1/users/me/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({bio: "About me"})
      .expect(200);

    await request(app)
      .patch("/v1/users/me/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({displayName: "Tu"})
      .expect(200);

    await request(app)
      .patch("/v1/users/me/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({dateOfBirth: "1990-01-01"})
      .expect(200);

    await request(app)
      .patch("/v1/users/me/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({gender: "nonbinary"})
      .expect(200);

    await request(app)
      .patch("/v1/users/me/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({gender: "invalid"})
      .expect(400);

    await request(app)
      .patch("/v1/users/me/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({dateOfBirth: "1998/07/15"})
      .expect(400);

    const emptyPatch = await request(app)
      .patch("/v1/users/me/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({})
      .expect(400);

    expect(emptyPatch.body.error?.code).toBe("BAD_REQUEST");
    expect(emptyPatch.body.error?.message).toBe("Validation failed");

    const profile = await request(app)
      .get("/v1/users/me/profile")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(profile.body.displayName).toBe("Tu");
    expect(profile.body.bio).toBe("About me");
    expect(profile.body.dateOfBirth).toBe("1990-01-01");
    expect(profile.body.gender).toBe("nonbinary");
    expect(profile.body.lastName).toBeNull();
  });

  it("PATCH with `location` + `userLocation` round-trips on GET; legacy-only `location` still works", async () => {
    const phone = randomE164();
    const send = await request(app)
      .post("/v1/auth/phone/send-otp")
      .send({phoneE164: phone})
      .expect(200);

    const verify = await request(app)
      .post("/v1/auth/phone/verify-otp")
      .send({code: send.body.devOtp as string, phoneE164: phone})
      .expect(200);

    const token = verify.body.accessToken as string;

    const userLocation = {
      area: "Hinjawadi",
      city: "Pune",
      country: "India",
      label: "Hinjawadi, Pune",
      latitude: 18.59,
      longitude: 73.73,
    } as const;

    const both = await request(app)
      .patch("/v1/users/me/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({location: "Hinjawadi, Pune", userLocation})
      .expect(200);

    expect(both.body.location).toBe("Hinjawadi, Pune");
    expect(both.body.userLocation).toEqual(userLocation);

    const g1 = await request(app)
      .get("/v1/users/me/profile")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(g1.body.location).toBe("Hinjawadi, Pune");
    expect(g1.body.userLocation).toEqual(userLocation);

    const legacyOnly = await request(app)
      .patch("/v1/users/me/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({location: "Camp, Pune, India"})
      .expect(200);
    expect(legacyOnly.body.location).toBe("Camp, Pune, India");
    expect(legacyOnly.body.userLocation).toEqual(userLocation);

    const g2 = await request(app)
      .get("/v1/users/me/profile")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(g2.body.location).toBe("Camp, Pune, India");
    expect(g2.body.userLocation).toEqual(userLocation);
  });

  it("PATCH work/education basics persists and GET returns them; height null clears", async () => {
    const phone = randomE164();
    const send = await request(app)
      .post("/v1/auth/phone/send-otp")
      .send({phoneE164: phone})
      .expect(200);

    const verify = await request(app)
      .post("/v1/auth/phone/verify-otp")
      .send({code: send.body.devOtp as string, phoneE164: phone})
      .expect(200);

    const token = verify.body.accessToken as string;

    await request(app)
      .patch("/v1/users/me/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        companyName: "Zeni",
        degree: "bachelors",
        height: 175,
        hometown: "Pune",
        jobTitle: "Developer",
        location: "Hinjawadi",
        schoolName: "SPPU",
      })
      .expect(200);

    const profile = await request(app)
      .get("/v1/users/me/profile")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(profile.body.jobTitle).toBe("Developer");
    expect(profile.body.companyName).toBe("Zeni");
    expect(profile.body.degree).toBe("bachelors");
    expect(profile.body.schoolName).toBe("SPPU");
    expect(profile.body.location).toBe("Hinjawadi");
    expect(profile.body.hometown).toBe("Pune");
    expect(profile.body.height).toBe(175);

    await request(app)
      .patch("/v1/users/me/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({height: null})
      .expect(200);

    const after = await request(app)
      .get("/v1/users/me/profile")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(after.body.height).toBeNull();
    expect(after.body.jobTitle).toBe("Developer");
  });

  it("PATCH basics *Public flags persists; GET returns them for owner", async () => {
    const phone = randomE164();
    const send = await request(app)
      .post("/v1/auth/phone/send-otp")
      .send({phoneE164: phone})
      .expect(200);

    const verify = await request(app)
      .post("/v1/auth/phone/verify-otp")
      .send({code: send.body.devOtp as string, phoneE164: phone})
      .expect(200);

    const token = verify.body.accessToken as string;

    await request(app)
      .patch("/v1/users/me/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        companyName: "Zeni",
        jobTitle: "Senior Engineer",
        jobTitlePublic: false,
        location: "Pune",
        locationPublic: false,
      })
      .expect(200);

    const profile = await request(app)
      .get("/v1/users/me/profile")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(profile.body.jobTitle).toBe("Senior Engineer");
    expect(profile.body.jobTitlePublic).toBe(false);
    expect(profile.body.companyName).toBe("Zeni");
    expect(profile.body.companyNamePublic).toBe(true);
    expect(profile.body.location).toBe("Pune");
    expect(profile.body.locationPublic).toBe(false);
  });

  it("refresh rotates tokens and logout revokes refresh", async () => {
    const phone = randomE164();
    const send = await request(app)
      .post("/v1/auth/phone/send-otp")
      .send({phoneE164: phone})
      .expect(200);

    const verify = await request(app)
      .post("/v1/auth/phone/verify-otp")
      .send({code: send.body.devOtp as string, phoneE164: phone})
      .expect(200);

    const refreshed = await request(app)
      .post("/v1/auth/refresh")
      .send({refreshToken: verify.body.refreshToken as string})
      .expect(200);

    expect(refreshed.body.refreshToken).not.toBe(verify.body.refreshToken);

    await request(app)
      .post("/v1/auth/logout")
      .send({refreshToken: refreshed.body.refreshToken as string})
      .expect(200);

    await request(app)
      .post("/v1/auth/refresh")
      .send({refreshToken: refreshed.body.refreshToken as string})
      .expect(401);
  });
});
