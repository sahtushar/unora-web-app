export type AuthHttpBridge = {
  applyRefreshedTokens: (accessToken: string, refreshToken: string) => void;
  clearSession: () => void;
  getAccessToken: () => string | undefined;
  getRefreshToken: () => string | undefined;
};

let bridge: AuthHttpBridge | null = null;

export function registerAuthHttpBridge(next: AuthHttpBridge | null): void {
  bridge = next;
}

export function getAuthHttpBridge(): AuthHttpBridge | null {
  return bridge;
}
