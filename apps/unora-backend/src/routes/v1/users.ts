import type {NextFunction, Request, Response} from "express";
import {Router} from "express";
import {rateLimit} from "express-rate-limit";
import multer from "multer";
import {RedisStore} from "rate-limit-redis";
import {z} from "zod";

import {AppError} from "../../lib/errors.js";
import {rateLimitValidateSkipProxyGuards} from "../../lib/rateLimitBehindProxy.js";
import {createRedisSendCommand} from "../../lib/redisSendCommand.js";
import {parseBody} from "../../lib/validate.js";
import type {AuthDeps} from "../../modules/auth/auth.service.js";
import type {UserPhotoObjectStorage} from "../../modules/media/userPhotoObjectStorage.js";
import {
  createUserPhoto,
  deleteUserPhoto,
} from "../../modules/userPhotos/userPhoto.service.js";
import {patchMyProfileBodySchema} from "../../modules/userProfile/matchPreferences.js";
import {
  assertUserExists,
  getUserProfileJson,
  updateUserProfileBasics,
  updateUserProfileInterests,
  upsertUserMatchPreferences,
} from "../../modules/userProfile/userProfile.service.js";
import type {RedisClient} from "../../redis/client.js";
import {requireAccessJwt} from "./requireAccessJwt.js";

const allowedPartMimes = new Set(["image/jpeg", "image/png", "image/webp"]);

const photoIdParam = z.object({
  photoId: z.string().uuid(),
});

function createUploadRateLimit(auth: AuthDeps, redis: RedisClient) {
  return rateLimit({
    legacyHeaders: false,
    max: auth.env.RATE_LIMIT_UPLOAD_MAX,
    passOnStoreError: true,
    standardHeaders: true,
    validate: rateLimitValidateSkipProxyGuards,
    store: new RedisStore({
      prefix: "unora:rl:upload:",
      sendCommand: createRedisSendCommand(redis),
    }),
    windowMs: auth.env.RATE_LIMIT_UPLOAD_WINDOW_MS,
  });
}

function createUploadMiddleware(auth: AuthDeps) {
  return multer({
    fileFilter: (_req, file, cb) => {
      const mime = file.mimetype.toLowerCase();
      if (allowedPartMimes.has(mime)) {
        cb(null, true);
        return;
      }
      cb(
        new AppError(
          "BAD_REQUEST",
          "Only JPEG, PNG, and WebP images are allowed (multipart part must be image/jpeg, image/png, or image/webp)"
        )
      );
    },
    limits: {fileSize: auth.env.USER_PHOTOS_MAX_BYTES, files: 1},
    storage: multer.memoryStorage(),
  });
}

export function createUsersRouter(
  auth: AuthDeps,
  redis: RedisClient,
  userPhotoStorage: UserPhotoObjectStorage
): Router {
  const router = Router();
  const uploadLimiter = createUploadRateLimit(auth, redis);
  const upload = createUploadMiddleware(auth);

  router.use(requireAccessJwt(auth));

  router.get(
    "/me/profile",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = req.authUser?.id;
        if (userId === undefined) {
          throw new AppError("UNAUTHORIZED", "Missing bearer token");
        }
        await assertUserExists(auth.db, userId);
        const profile = await getUserProfileJson(auth.db, auth.env, userId);
        res.json(profile);
      } catch (error) {
        next(error);
      }
    }
  );

  router.patch(
    "/me/profile",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = req.authUser?.id;
        if (userId === undefined) {
          throw new AppError("UNAUTHORIZED", "Missing bearer token");
        }
        await assertUserExists(auth.db, userId);
        const body = parseBody(patchMyProfileBodySchema, req.body);
        if (
          body.displayName !== undefined ||
          body.bio !== undefined ||
          body.companyName !== undefined ||
          body.companyNamePublic !== undefined ||
          body.dateOfBirth !== undefined ||
          body.degree !== undefined ||
          body.degreePublic !== undefined ||
          body.gender !== undefined ||
          body.height !== undefined ||
          body.heightPublic !== undefined ||
          body.hometown !== undefined ||
          body.hometownPublic !== undefined ||
          body.jobTitle !== undefined ||
          body.jobTitlePublic !== undefined ||
          body.lastName !== undefined ||
          body.location !== undefined ||
          body.locationPublic !== undefined ||
          body.schoolName !== undefined ||
          body.schoolNamePublic !== undefined ||
          body.userLocation !== undefined
        ) {
          await updateUserProfileBasics(auth.db, userId, {
            bio: body.bio,
            companyName: body.companyName,
            companyNamePublic: body.companyNamePublic,
            dateOfBirth: body.dateOfBirth,
            degree: body.degree,
            degreePublic: body.degreePublic,
            displayName: body.displayName,
            gender: body.gender,
            height: body.height,
            heightPublic: body.heightPublic,
            hometown: body.hometown,
            hometownPublic: body.hometownPublic,
            jobTitle: body.jobTitle,
            jobTitlePublic: body.jobTitlePublic,
            lastName: body.lastName,
            location: body.location,
            locationPublic: body.locationPublic,
            schoolName: body.schoolName,
            schoolNamePublic: body.schoolNamePublic,
            userLocation: body.userLocation,
          });
        }
        if (body.preferences !== undefined) {
          await upsertUserMatchPreferences(auth.db, userId, body.preferences);
        }
        if (body.interests !== undefined) {
          await updateUserProfileInterests(auth.db, userId, body.interests);
        }
        const profile = await getUserProfileJson(auth.db, auth.env, userId);
        res.status(200).json(profile);
      } catch (error) {
        next(error);
      }
    }
  );

  router.post(
    "/me/photos",
    uploadLimiter,
    upload.single("file"),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = req.authUser?.id;
        if (userId === undefined) {
          throw new AppError("UNAUTHORIZED", "Missing bearer token");
        }
        if (req.file === undefined) {
          throw new AppError("BAD_REQUEST", 'Missing multipart field "file"');
        }
        const body = await createUserPhoto(
          auth.db,
          auth.env,
          userPhotoStorage,
          {
            buffer: req.file.buffer,
            mimeFromPart: req.file.mimetype,
            userId,
          }
        );
        res.status(201).json(body);
      } catch (error) {
        next(error);
      }
    }
  );

  router.delete(
    "/me/photos/:photoId",
    uploadLimiter,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = req.authUser?.id;
        if (userId === undefined) {
          throw new AppError("UNAUTHORIZED", "Missing bearer token");
        }
        const {photoId} = parseBody(photoIdParam, req.params);
        await deleteUserPhoto(auth.db, auth.env, userPhotoStorage, {
          photoId,
          userId,
        });
        res.status(204).send();
      } catch (error) {
        next(error);
      }
    }
  );

  router.use(
    (err: unknown, _req: Request, _res: Response, next: NextFunction) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          next(
            new AppError(
              "BAD_REQUEST",
              `Image must be at most ${String(auth.env.USER_PHOTOS_MAX_BYTES)} bytes`
            )
          );
          return;
        }
        next(new AppError("BAD_REQUEST", err.message));
        return;
      }
      next(err);
    }
  );

  return router;
}
