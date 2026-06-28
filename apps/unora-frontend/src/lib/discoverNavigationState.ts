/** `location.state` when returning from `DetailedProfilePage` → `DiscoverPage`. */
export type DiscoverIntentPayload = {
  intent: "pass" | "like";
  profileId: string;
};

export type DiscoverLocationState = {
  discoverIntent?: DiscoverIntentPayload;
};
