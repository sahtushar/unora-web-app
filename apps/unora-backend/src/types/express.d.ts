import type {Logger} from "../lib/logger.js";

declare global {
  namespace Express {
    interface Request {
      authUser?: {id: string};
      log?: Logger;
    }
  }
}

export {};
