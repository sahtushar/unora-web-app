import type {Photo} from "@/types";

/**
 * Current shape of `GET /v1/auth/me` from unora-backend (`auth.service` `getMe` + JSON serialization).
 * Optional `photos` is forward-compatible when the backend adds a gallery.
 */
export type ApiAuthMeResponse = {
  createdAt: string;
  email: string | null;
  googleSub: string | null;
  id: string;
  lastLoginAt: string | null;
  phoneE164: string | null;
  updatedAt: string;
  photos?: Photo[];
};
