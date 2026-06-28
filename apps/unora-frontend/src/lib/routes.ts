export const routes = {
  login: "/login",
  completeProfile: "/complete-profile",
  discover: "/",
  connection: "/connection",
  interested: "/interested",
  profile: "/profile",
  profileEdit: "/profile/edit",
  profileEditInterests: "/profile/edit/interests",
} as const;

/** Full profile sheet from Discover (mock catalog lookup). */
export function discoverProfilePath(profileId: string): string {
  return `/discover/${encodeURIComponent(profileId)}`;
}

export type AppRoute = (typeof routes)[keyof typeof routes];
