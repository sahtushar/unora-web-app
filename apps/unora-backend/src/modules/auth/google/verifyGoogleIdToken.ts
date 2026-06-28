import {OAuth2Client} from "google-auth-library";

import {AppError} from "../../../lib/errors.js";

export type GoogleIdentity = {
  email: string | null;
  emailVerified: boolean;
  sub: string;
};

export async function verifyGoogleIdToken(params: {
  audience: string[];
  idToken: string;
}): Promise<GoogleIdentity> {
  try {
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
      audience: params.audience,
      idToken: params.idToken,
    });
    const payload = ticket.getPayload();
    if (
      payload === undefined ||
      typeof payload.sub !== "string" ||
      payload.sub.length === 0
    ) {
      throw new AppError("UNAUTHORIZED", "Invalid Google identity token");
    }

    return {
      email: payload.email ?? null,
      emailVerified: payload.email_verified === true,
      sub: payload.sub,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("UNAUTHORIZED", "Invalid Google identity token");
  }
}
