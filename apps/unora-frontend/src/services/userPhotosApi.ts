import {dataUrlToBlob} from "@/lib/dataUrlToBlob";
import {resolveMediaUrl} from "@/lib/resolveMediaUrl";
import type {Photo} from "@/types";

import {http} from "./http";
import {HttpError} from "./httpError";

/** Response contract for `POST /v1/users/me/photos` (implement on backend). */
export type UploadUserPhotoResponse = {
  id: string;
  url: string;
  alt?: string;
  blurDataUrl?: string;
};

/**
 * Upload one profile image (JPEG/PNG/WebP). Backend should validate auth, size, and mime;
 * return a stable CDN URL and id for the gallery row.
 */
export async function uploadUserPhoto(
  file: Blob,
  filename = "profile.jpg"
): Promise<UploadUserPhotoResponse> {
  const form = new FormData();
  form.append("file", file, filename);
  return http.requestForm<UploadUserPhotoResponse>("/v1/users/me/photos", form);
}

/**
 * Remove one gallery row on the server (`DELETE /v1/users/me/photos/:id`).
 * Ignores **404** so local/mock ids do not surface as hard errors.
 */
export async function deleteUserPhoto(photoId: string): Promise<void> {
  const path = `/v1/users/me/photos/${encodeURIComponent(photoId)}`;
  try {
    await http.requestVoid(path, {method: "DELETE"});
  } catch (err) {
    if (err instanceof HttpError && err.status === 404) {
      return;
    }
    throw err;
  }
}

/**
 * Upload any client-side `data:` photo entries and return a full gallery with HTTPS URLs.
 * Skips entries that already use a non-data URL (e.g. existing CDN photos).
 */
export async function persistNewDataUrlPhotos(
  photos: readonly Photo[]
): Promise<Photo[]> {
  const next: Photo[] = [];
  for (const p of photos) {
    if (p.url.startsWith("data:")) {
      const blob = await dataUrlToBlob(p.url);
      const uploaded = await uploadUserPhoto(blob, "profile.jpg");
      next.push({
        id: uploaded.id,
        url: resolveMediaUrl(uploaded.url),
        alt: uploaded.alt ?? p.alt,
        blurDataUrl: uploaded.blurDataUrl,
      });
    } else {
      next.push(p);
    }
  }
  return next;
}
