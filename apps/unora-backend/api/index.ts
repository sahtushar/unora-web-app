/**
 * Vercel serverless entry: all HTTP traffic is rewritten here (see `vercel.json`).
 * @see https://vercel.com/docs/functions/runtimes/node-js
 */
import type {VercelRequest, VercelResponse} from "@vercel/node";
import type {NextFunction, Request, Response} from "express";

import {getServerlessApp} from "../src/serverless/bootstrap.js";

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const app = await getServerlessApp();
  await new Promise<void>((resolve, reject) => {
    res.once("finish", () => {
      resolve();
    });
    res.once("error", reject);
    const next: NextFunction = (err?: unknown) => {
      if (err !== undefined && err !== null) {
        reject(err instanceof Error ? err : new Error(String(err)));
      }
    };
    app(req as unknown as Request, res as unknown as Response, next);
  });
}
