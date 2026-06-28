import type {CurrentUserProfile} from "@/types";

import type {ProfileCreationController} from "./useProfileCreation";

export type ProfileEditOutletContext = {
  profile: ProfileCreationController;
  user: CurrentUserProfile;
};
