import {useMemo} from "react";

import {DetailedProfileLayout} from "@/features/discover/DetailedProfileLayout";
import type {CurrentUserProfile} from "@/types";

import {strings} from "../strings";
import {buildDiscoverProfilePreview} from "./buildDiscoverProfilePreview";
import type {ProfileCreationDraft} from "./profileCreationModel";

const p = strings.profile;

type Props = {
  draft: ProfileCreationDraft;
  user: CurrentUserProfile;
};

/**
 * Full `DetailedProfileLayout` (same sections as the Discover detailed sheet) from the
 * current editor draft — “View” in profile edit, without pass/like or a close action.
 */
export function ProfileEditorPreviewView({user, draft}: Props) {
  const profile = useMemo(
    () => buildDiscoverProfilePreview(user, draft),
    [draft, user]
  );

  return (
    <div className="space-y-app-3">
      <p className="text-sm leading-relaxed text-unora-mist">
        {p.edit.publicPreviewHint}
      </p>
      <DetailedProfileLayout profile={profile} variant="preview" />
    </div>
  );
}
