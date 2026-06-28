import {getAuthMe, postGoogleSignIn} from "@/services/authApi";
import type {AuthTokenBundle} from "@/services/authApi";

export type {AuthTokenBundle} from "@/services/authApi";

/**
 * Sends the Google **ID token** (JWT from GIS `credential`) to `POST /v1/auth/google`.
 * GIS itself is wired in `GoogleSignInWidget` / `LoginPage`.
 */
export async function signInWithGoogle(
  idToken: string
): Promise<AuthTokenBundle> {
  return postGoogleSignIn(idToken);
}

/** `GET /v1/auth/me` — optional consumer for profile bootstrap. */
export {getAuthMe};
