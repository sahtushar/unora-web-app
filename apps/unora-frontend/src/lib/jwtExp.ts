/**
 * Read JWT `exp` (seconds since epoch) without verifying the signature — only for scheduling refresh.
 */
export function readJwtExpSeconds(jwt: string): number | null {
  const parts = jwt.split(".");
  if (parts.length < 2 || !parts[1]) {
    return null;
  }
  try {
    const json = atob(parts[1].replaceAll("-", "+").replaceAll("_", "/"));
    const payload = JSON.parse(json) as {exp?: unknown};
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}
