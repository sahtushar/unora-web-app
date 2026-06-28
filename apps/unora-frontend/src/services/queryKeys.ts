/** Centralized query keys for TanStack Query — prevents typos and eases invalidation. */
export const queryKeys = {
  session: ["session"] as const,
  discoverQueue: ["discover", "queue"] as const,
  discoverProfile: (id: string) => ["discover", "profile", id] as const,
  currentUser: ["me", "profile"] as const,
  interested: ["interested"] as const,
} as const;
