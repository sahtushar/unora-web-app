import type {NextFunction, Request, Response} from "express";

import {AppError} from "../../lib/errors.js";
import type {AuthDeps} from "../../modules/auth/auth.service.js";
import {verifyAccessJwt} from "../../modules/auth/tokens/accessJwt.js";

export function requireAccessJwt(auth: AuthDeps) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const header = req.headers.authorization;
      const token =
        typeof header === "string" && header.startsWith("Bearer ")
          ? header.slice("Bearer ".length).trim()
          : undefined;
      if (token === undefined || token.length === 0) {
        throw new AppError("UNAUTHORIZED", "Missing bearer token");
      }
      const payload = await verifyAccessJwt(auth.env, token);
      req.authUser = {id: payload.sub};
      next();
    } catch (error) {
      next(error);
    }
  };
}
