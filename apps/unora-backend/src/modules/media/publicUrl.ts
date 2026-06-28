import {GetObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";

import type {Env} from "../../config/env.js";

const s3ClientCache = new Map<string, S3Client>();

function getS3UrlClient(env: Env): S3Client {
  const cacheKey = [
    env.S3_REGION ?? "",
    env.S3_ENDPOINT ?? "",
    env.S3_ACCESS_KEY_ID ?? "",
    env.S3_SECRET_ACCESS_KEY ?? "",
  ].join("|");
  const cached = s3ClientCache.get(cacheKey);
  if (cached) {
    return cached;
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
    region: env.S3_REGION,
  });
  s3ClientCache.set(cacheKey, client);
  return client;
}

function staticPublicUrlForStorageKey(env: Env, storageKey: string): string {
  const base = env.PUBLIC_MEDIA_BASE_URL.replace(/\/$/, "");
  const key = storageKey.replace(/^\//, "");
  return `${base}/${key}`;
}

export async function publicUrlForStorageKey(
  env: Env,
  storageKey: string
): Promise<string> {
  if (env.USER_PHOTOS_STORAGE !== "s3") {
    return staticPublicUrlForStorageKey(env, storageKey);
  }
  if (env.S3_BUCKET === undefined || env.S3_BUCKET.length === 0) {
    // Env validation should prevent this, but keep safe fallback.
    return staticPublicUrlForStorageKey(env, storageKey);
  }
  const client = getS3UrlClient(env);
  return getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: storageKey,
    }),
    {expiresIn: env.S3_SIGNED_URL_TTL_SECONDS}
  );
}
