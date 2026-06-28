import {and, asc, eq, max} from "drizzle-orm";
import {randomUUID} from "node:crypto";

import type {Env} from "../../config/env.js";
import type {Db} from "../../db/client.js";
import {userPhotos} from "../../db/schema.js";
import {AppError} from "../../lib/errors.js";
import {publicUrlForStorageKey} from "../media/publicUrl.js";
import type {UserPhotoObjectStorage} from "../media/userPhotoObjectStorage.js";

const ALLOWED_IMAGE_MIMES = new Map<string, string>([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);

export type UserPhotoJson = {
  id: string;
  url: string;
  alt?: string;
  blurDataUrl?: string;
};

/** Shape for `GET /v1/users/me/profile` (frontend profileDetailsApi). */
export type UserProfilePhotoJson = {
  alt: string;
  id: string;
  url: string;
  blurDataUrl?: string;
};

export function userPhotosToProfilePayload(photos: UserPhotoJson[]): {
  photos: UserProfilePhotoJson[];
} {
  return {
    photos: photos.map((p) => {
      const row: UserProfilePhotoJson = {
        alt: p.alt ?? "",
        id: p.id,
        url: p.url,
      };
      if (p.blurDataUrl !== undefined && p.blurDataUrl.length > 0) {
        row.blurDataUrl = p.blurDataUrl;
      }
      return row;
    }),
  };
}

function extensionForMime(mime: string): string | undefined {
  return ALLOWED_IMAGE_MIMES.get(mime);
}

export function assertAllowedImageMime(mime: string | undefined): string {
  const normalized = mime?.split(";")[0]?.trim().toLowerCase();
  if (
    normalized === undefined ||
    normalized.length === 0 ||
    !ALLOWED_IMAGE_MIMES.has(normalized)
  ) {
    throw new AppError(
      "BAD_REQUEST",
      "Only JPEG, PNG, and WebP images are allowed (each part must declare image/jpeg, image/png, or image/webp)"
    );
  }
  return normalized;
}

export async function mapRowToPhotoJson(
  env: Env,
  row: {
    alt: string | null;
    blurDataUrl: string | null;
    id: string;
    storageKey: string;
  }
): Promise<UserPhotoJson> {
  const out: UserPhotoJson = {
    id: row.id,
    url: await publicUrlForStorageKey(env, row.storageKey),
  };
  if (row.alt !== null && row.alt.length > 0) {
    out.alt = row.alt;
  }
  if (row.blurDataUrl !== null && row.blurDataUrl.length > 0) {
    out.blurDataUrl = row.blurDataUrl;
  }
  return out;
}

export async function listUserPhotosJson(
  db: Db,
  env: Env,
  userId: string
): Promise<UserPhotoJson[]> {
  const rows = await db
    .select({
      alt: userPhotos.alt,
      blurDataUrl: userPhotos.blurDataUrl,
      id: userPhotos.id,
      storageKey: userPhotos.storageKey,
    })
    .from(userPhotos)
    .where(eq(userPhotos.userId, userId))
    .orderBy(asc(userPhotos.sortOrder), asc(userPhotos.createdAt));

  return Promise.all(rows.map((row) => mapRowToPhotoJson(env, row)));
}

export async function createUserPhoto(
  db: Db,
  env: Env,
  storage: UserPhotoObjectStorage,
  params: {
    buffer: Buffer;
    mimeFromPart: string | undefined;
    userId: string;
  }
): Promise<UserPhotoJson> {
  const mime = assertAllowedImageMime(params.mimeFromPart);
  const ext = extensionForMime(mime);
  if (ext === undefined) {
    throw new AppError("BAD_REQUEST", "Unsupported image type");
  }

  const existing = await db
    .select({id: userPhotos.id})
    .from(userPhotos)
    .where(eq(userPhotos.userId, params.userId));

  if (existing.length >= env.USER_PHOTOS_MAX_PER_USER) {
    throw new AppError(
      "BAD_REQUEST",
      `You can upload at most ${String(env.USER_PHOTOS_MAX_PER_USER)} profile photos. Delete one before adding another.`
    );
  }

  const [agg] = await db
    .select({value: max(userPhotos.sortOrder)})
    .from(userPhotos)
    .where(eq(userPhotos.userId, params.userId));

  const maxSort = agg?.value ?? null;
  const nextSort = (maxSort ?? -1) + 1;

  const fileId = randomUUID();
  const storageKey = `user-photos/${params.userId}/${fileId}${ext}`;
  const storeInPostgres = env.USER_PHOTOS_STORAGE === "postgres";

  if (!storeInPostgres) {
    await storage.put({
      buffer: params.buffer,
      contentType: mime,
      storageKey,
    });
  }

  try {
    const [inserted] = await db
      .insert(userPhotos)
      .values(
        storeInPostgres
          ? {
              objectContentType: mime,
              objectData: params.buffer,
              sortOrder: nextSort,
              storageKey,
              userId: params.userId,
            }
          : {
              sortOrder: nextSort,
              storageKey,
              userId: params.userId,
            }
      )
      .returning({
        alt: userPhotos.alt,
        blurDataUrl: userPhotos.blurDataUrl,
        id: userPhotos.id,
        storageKey: userPhotos.storageKey,
      });

    if (!inserted) {
      throw new AppError("INTERNAL", "Failed to save photo metadata");
    }
    return await mapRowToPhotoJson(env, inserted);
  } catch (error) {
    if (!storeInPostgres) {
      await storage.delete({storageKey}).catch(() => {});
    }
    throw error;
  }
}

export async function deleteUserPhoto(
  db: Db,
  env: Env,
  storage: UserPhotoObjectStorage,
  params: {photoId: string; userId: string}
): Promise<void> {
  const [row] = await db
    .select({id: userPhotos.id, storageKey: userPhotos.storageKey})
    .from(userPhotos)
    .where(
      and(
        eq(userPhotos.id, params.photoId),
        eq(userPhotos.userId, params.userId)
      )
    )
    .limit(1);

  if (!row) {
    throw new AppError("NOT_FOUND", "Photo not found");
  }

  await db.delete(userPhotos).where(eq(userPhotos.id, row.id));
  await storage.delete({storageKey: row.storageKey}).catch(() => {});
}
