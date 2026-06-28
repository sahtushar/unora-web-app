export type SignInPayload = {
  accessToken: string;
  /** When omitted (mock phone path), any prior refresh token is cleared. */
  refreshToken?: string | null;
};

export type AuthContextValue = {
  isAuthenticated: boolean;
  token: string | null;
  signIn: (payload: SignInPayload) => void;
  signOut: () => Promise<void>;
};
