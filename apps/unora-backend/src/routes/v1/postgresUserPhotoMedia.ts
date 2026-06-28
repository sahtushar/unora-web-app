import {and, eq} from "drizzle-orm";
import {Router} from "express";

import type {Db} from "../../db/client.js";
import {userPhotos} from "../../db/schema.js";
import {AppError} from "../../lib/errors.js";

const uuidRe =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const fileRe =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpe?g|png|webp)$/i;

/**
 * Serves public photo URLs for `USER_PHOTOS_STORAGE=postgres` — same path shape as
 * `createLocalMediaRouter` so `PUBLIC_MEDIA_BASE_URL` and frontend `url` fields stay stable.
 */
export function createPostgresUserPhotoMediaRouter(db: Db): Router {
  const router = Router();

  router.get("/user-photos/:userId/:filename", (req, res, next) => {
    void (async () => {
      try {
        const {filename, userId} = req.params;
        if (
          userId === undefined ||
          filename === undefined ||
          !uuidRe.test(userId) ||
          !fileRe.test(filename)
        ) {
          throw new AppError("NOT_FOUND", "Not found");
        }

        const storageKey = `user-photos/${userId}/${filename}`;

        const [row] = await db
          .select({
            objectContentType: userPhotos.objectContentType,
            objectData: userPhotos.objectData,
          })
          .from(userPhotos)
          .where(
            and(
              eq(userPhotos.userId, userId),
              eq(userPhotos.storageKey, storageKey)
            )
          )
          .limit(1);

        if (row === undefined) {
          throw new AppError("NOT_FOUND", "Not found");
        }
        const objectData = row.objectData;
        if (objectData === null || objectData.length === 0) {
          throw new AppError("NOT_FOUND", "Not found");
        }
        const {objectContentType} = row;
        const ct =
          objectContentType !== null && objectContentType.length > 0
            ? objectContentType
            : "application/octet-stream";
        res.setHeader("Content-Type", ct);
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        res.send(objectData);
      } catch (error) {
        next(error);
      }
    })();
  });

  return router;
}
