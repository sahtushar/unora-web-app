import {Router} from "express";

import type {Env} from "../../config/env.js";
import type {AuthDeps} from "../../modules/auth/auth.service.js";
import type {UserPhotoObjectStorage} from "../../modules/media/userPhotoObjectStorage.js";
import type {RedisClient} from "../../redis/client.js";
import {createAuthRouter} from "./auth.js";
import {createLocalMediaRouter} from "./localMedia.js";
import {createPostgresUserPhotoMediaRouter} from "./postgresUserPhotoMedia.js";
import {createUsersRouter} from "./users.js";

export type V1RouterOpts = {
  auth: AuthDeps;
  env: Env;
  redis: RedisClient;
  userPhotoStorage: UserPhotoObjectStorage;
};

export function createV1Router(opts: V1RouterOpts): Router {
  const r = Router();
  if (opts.env.USER_PHOTOS_STORAGE === "local") {
    r.use("/media", createLocalMediaRouter(opts.env));
  } else if (opts.env.USER_PHOTOS_STORAGE === "postgres") {
    r.use("/media", createPostgresUserPhotoMediaRouter(opts.auth.db));
  }
  r.use("/auth", createAuthRouter(opts.auth, opts.redis));
  r.use(
    "/users",
    createUsersRouter(opts.auth, opts.redis, opts.userPhotoStorage)
  );
  return r;
}
