import {mockApiDelay} from "@/lib/mockApiDelay";

export interface AuthSession {
  accessToken: string;
  /** Mock: true when phone path simulates first-time onboarding */
  isNewUser: boolean;
  userId: string;
}

function randomId(prefix: string): string {
  const c = globalThis.crypto;
  if (c && "randomUUID" in c) {
    return `${prefix}_${c.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function digitCount(raw: string): number {
  return raw.replace(/\D/g, "").length;
}

/**
 * Mock Google OAuth — replace with real OAuth redirect / token exchange.
 */
export async function mockSignInWithGoogle(): Promise<AuthSession> {
  await mockApiDelay();
  return {
    accessToken: randomId("mock_google"),
    userId: "user-self",
    isNewUser: false,
  };
}

/**
 * Mock SMS send — replace with Twilio / Firebase Phone, etc.
 */
export async function mockSendPhoneOtp(phone: string): Promise<{ok: true}> {
  await mockApiDelay();
  if (digitCount(phone) < 10) {
    throw new Error("Enter a valid phone number.");
  }
  return {ok: true};
}

/**
 * Mock verify + sign-in / sign-up — demo code `000000` always succeeds.
 */
export async function mockVerifyPhoneAndSignIn(
  phone: string,
  code: string
): Promise<AuthSession> {
  await mockApiDelay();
  if (digitCount(phone) < 10) {
    throw new Error("Enter a valid phone number.");
  }
  if (code.trim() !== "000000") {
    throw new Error("Invalid code. For this preview, use 000000.");
  }
  return {
    accessToken: randomId("mock_phone"),
    userId: "user-self",
    isNewUser: true,
  };
}
