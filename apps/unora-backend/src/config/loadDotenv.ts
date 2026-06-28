import {config} from "dotenv";
import {existsSync} from "node:fs";
import {resolve} from "node:path";

/**
 * Loads `.env` then `.env.local` from the process cwd when those files exist.
 * `.env.local` overrides keys from `.env`. Existing OS/env-injected variables
 * are not overwritten by `.env` (`override: false`).
 */
export function loadDotenvFiles(): void {
  const root = process.cwd();
  const envPath = resolve(root, ".env");
  if (existsSync(envPath)) {
    config({override: false, path: envPath});
  }
  const localPath = resolve(root, ".env.local");
  if (existsSync(localPath)) {
    config({override: true, path: localPath});
  }
}
