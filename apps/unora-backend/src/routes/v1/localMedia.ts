import {Router} from "express";
import fs from "node:fs";
import path from "node:path";

import type {Env} from "../../config/env.js";
import {AppError} from "../../lib/errors.js";

const uuidRe =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const fileRe =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpe?g|png|webp)$/i;

export function createLocalMediaRouter(env: Env): Router {
  const router = Router();

  router.get("/user-photos/:userId/:filename", (req, res, next) => {
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

      const filePath = path.join(
        env.USER_PHOTOS_LOCAL_DIR,
        "user-photos",
        userId,
        filename
      );
      const resolved = path.resolve(filePath);
      const root = path.resolve(env.USER_PHOTOS_LOCAL_DIR);
      if (!resolved.startsWith(root + path.sep) && resolved !== root) {
        throw new AppError("NOT_FOUND", "Not found");
      }

      if (!fs.existsSync(resolved)) {
        throw new AppError("NOT_FOUND", "Not found");
      }

      res.sendFile(resolved, (err) => {
        if (err !== undefined && err !== null) {
          next(err);
        }
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
