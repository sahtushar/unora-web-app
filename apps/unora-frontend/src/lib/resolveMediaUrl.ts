import type {Photo} from "@/types";

function trimTrailingSlash(s: string): string {
  return s.endsWith("/") ? s.slice(0, -1) : s;
}

function apiBaseOrigin(): string | undefined {
  const rawBase = import.meta.env.VITE_API_URL ?? "";
  const base = trimTrailingSlash(typeof rawBase === "string" ? rawBase : "");
  if (!/^https?:\/\//i.test(base)) {
    return undefined;
  }
  try {
    return new URL(base).origin;
  } catch {
    return undefined;
  }
}

/** In dev, map `http://api/v1/...` → `/v1/...` so `<img>` is same-origin (Vite proxy); avoids CORP blocks. */
function devSameOriginPathIfApiV1(absoluteUrl: string): string | undefined {
  if (!import.meta.env.DEV || !/^https?:\/\//i.test(absoluteUrl)) {
    return undefined;
  }
  const apiOrigin = apiBaseOrigin();
  if (apiOrigin === undefined) {
    return undefined;
  }
  try {
    const parsed = new URL(absoluteUrl);
    if (parsed.origin === apiOrigin && parsed.pathname.startsWith("/v1")) {
      return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
  } catch {
    /* ignore */
  }
  return undefined;
}

function resolveProtocolRelative(u: string): string {
  const w = globalThis.window;
  if (w === undefined) {
    return `https:${u}`;
  }
  return `${w.location.protocol}${u}`;
}

function resolveRootRelative(path: string, base: string): string {
  if (!/^https?:\/\//i.test(base)) {
    return path;
  }
  if (import.meta.env.DEV && path.startsWith("/v1")) {
    return path;
  }
  return `${base}${path}`;
}

/**
 * API asset paths are often root-relative (`/v1/...`, `/uploads/...`). `<img src>` resolves those
 * against the **page** origin, not the API host — wrong host = broken image.
 *
 * **Cross-origin CORP:** If the API sends `Cross-Origin-Resource-Policy: same-origin` on media,
 * embedding from the Vite app (`localhost:3000`) in `<img src="http://127.0.0.1:8000/...">` fails
 * with `ERR_BLOCKED_BY_RESPONSE.NotSameOrigin` even when the request returns 200. In **dev** we
 * therefore keep `/v1/...` URLs **same-origin** and rely on `vite.config.ts` `server.proxy` to the
 * API. In production, prefer absolute CDN URLs or set **`Cross-Origin-Resource-Policy: cross-origin`**
 * (or omit CORP) on public image responses.
 */
export function resolveMediaUrl(url: string): string {
  const u = url.trim();
  if (u.length === 0) {
    return u;
  }
  if (/^(data:|blob:|https?:)/i.test(u)) {
    const corpSafe = devSameOriginPathIfApiV1(u);
    return corpSafe ?? u;
  }
  if (u.startsWith("//")) {
    return resolveProtocolRelative(u);
  }
  const rawBase = import.meta.env.VITE_API_URL ?? "";
  const base = trimTrailingSlash(typeof rawBase === "string" ? rawBase : "");
  if (u.startsWith("/")) {
    return resolveRootRelative(u, base);
  }
  if (/^https?:\/\//i.test(base)) {
    return `${base}/${u.replace(/^\/+/, "")}`;
  }
  return u;
}

/** Ensure `photo.url` is usable as `<img src>` when the API returns root-relative paths. */
export function normalizePhotoMediaUrls(photo: Photo): Photo {
  return {...photo, url: resolveMediaUrl(photo.url)};
}
