import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import fs from "node:fs/promises";
import path from "node:path";

import type {Env} from "../../config/env.js";

export type PutUserPhotoObjectParams = {
  buffer: Buffer;
  contentType: string;
  storageKey: string;
};

export type UserPhotoObjectStorage = {
  delete(params: {storageKey: string}): Promise<void>;
  put(params: PutUserPhotoObjectParams): Promise<void>;
};

export function createLocalUserPhotoObjectStorage(
  env: Env
): UserPhotoObjectStorage {
  const root = env.USER_PHOTOS_LOCAL_DIR;
  return {
    async delete({storageKey}) {
      const fullPath = path.join(root, storageKey);
      const resolved = path.resolve(fullPath);
      const rootResolved = path.resolve(root);
      if (
        !resolved.startsWith(rootResolved + path.sep) &&
        resolved !== rootResolved
      ) {
        return;
      }
      await fs.unlink(resolved).catch(() => {});
    },
    async put({buffer, storageKey}) {
      const fullPath = path.join(root, storageKey);
      const resolved = path.resolve(fullPath);
      const rootResolved = path.resolve(root);
      if (
        !resolved.startsWith(rootResolved + path.sep) &&
        resolved !== rootResolved
      ) {
        throw new Error("Invalid storage key");
      }
      await fs.mkdir(path.dirname(resolved), {recursive: true});
      await fs.writeFile(resolved, buffer);
    },
  };
}

/**
 * BLOBs are stored in `user_photos.object_data` by the service; this adapter keeps the same
 * `UserPhotoObjectStorage` port so switching to `s3` or `local` is a config and insert-path change.
 */
function createPostgresUserPhotoObjectStorage(): UserPhotoObjectStorage {
  return {
    async delete() {},
    async put() {},
  };
}

export function createS3UserPhotoObjectStorage(
  env: Env
): UserPhotoObjectStorage {
  const bucket = env.S3_BUCKET;
  const region = env.S3_REGION;
  if (
    bucket === undefined ||
    bucket.length === 0 ||
    region === undefined ||
    region.length === 0
  ) {
    throw new Error(
      "S3 bucket and region are required for USER_PHOTOS_STORAGE=s3"
    );
  }

  const client = new S3Client({
    credentials:
      env.S3_ACCESS_KEY_ID !== undefined &&
      env.S3_ACCESS_KEY_ID.length > 0 &&
      env.S3_SECRET_ACCESS_KEY !== undefined &&
      env.S3_SECRET_ACCESS_KEY.length > 0
        ? {
            accessKeyId: env.S3_ACCESS_KEY_ID,
            secretAccessKey: env.S3_SECRET_ACCESS_KEY,
          }
        : undefined,
    endpoint: env.S3_ENDPOINT,
    forcePathStyle: env.S3_ENDPOINT !== undefined && env.S3_ENDPOINT.length > 0,
    region,
  });

  return {
    async delete({storageKey}) {
      await client.send(
        new DeleteObjectCommand({Bucket: bucket, Key: storageKey})
      );
    },
    async put({buffer, contentType, storageKey}) {
      await client.send(
        new PutObjectCommand({
          Body: buffer,
          Bucket: bucket,
          ContentType: contentType,
          Key: storageKey,
        })
      );
    },
  };
}

export function createUserPhotoObjectStorage(env: Env): UserPhotoObjectStorage {
  if (env.USER_PHOTOS_STORAGE === "s3") {
    return createS3UserPhotoObjectStorage(env);
  }
  if (env.USER_PHOTOS_STORAGE === "postgres") {
    return createPostgresUserPhotoObjectStorage();
  }
  return createLocalUserPhotoObjectStorage(env);
}
