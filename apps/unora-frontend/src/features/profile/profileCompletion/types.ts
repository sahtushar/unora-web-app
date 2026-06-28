import type {GenderPresentation} from "@/types";

import type {ProfilePreferencesDraft} from "../profileCreationModel";

export const ABOUT_MIN_LENGTH = 24;
export const ABOUT_MAX_LENGTH = 280;

export type SlideId =
  | "welcome"
  | "preferences"
  | "interests"
  | "about"
  | "location";

export type CompletionDraft = {
  area: string;
  bio: string;
  city: string;
  country: string;
  dateOfBirth: string;
  firstName: string;
  gender: GenderPresentation;
  gps: {lat: number; lng: number} | null;
  interests: string[];
  lastName: string;
  latitude: number | null;
  location: string;
  longitude: number | null;
  preferences: ProfilePreferencesDraft;
};
