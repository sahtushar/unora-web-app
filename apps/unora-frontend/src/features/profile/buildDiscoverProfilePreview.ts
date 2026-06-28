import {DATING_INTENTION_PRESET_IDS} from "@/types";
import type {
  CurrentUserProfile,
  DatingIntentionPresetId,
  DiscoverProfile,
} from "@/types";

import {strings} from "../strings";
import type {ProfileCreationDraft} from "./profileCreationModel";

const intentionPresetLabels = strings.profile.profileCreation.preferences
  .intentionPresets as Record<DatingIntentionPresetId, string>;

function intentionIdFromText(text: string): DatingIntentionPresetId {
  const t = text.trim();
  const key = DATING_INTENTION_PRESET_IDS.find(
    (k) => intentionPresetLabels[k] === t
  );
  return key ?? "figuring_out";
}

function headlineFromDraft(d: ProfileCreationDraft): string {
  const first = d.bio.trim().split("\n")[0] ?? "";
  if (first.length > 0) {
    return first.length > 120 ? `${first.slice(0, 117)}…` : first;
  }
  if (d.promptAnswer.trim().length > 0) {
    return d.promptAnswer.trim().slice(0, 120);
  }
  return "—";
}

const preview = strings.profile.edit;

/**
 * Maps the profile editor’s local draft + server user identity into a `DiscoverProfile` for
 * a discover-style card preview.
 */
export function buildDiscoverProfilePreview(
  user: CurrentUserProfile,
  draft: ProfileCreationDraft
): DiscoverProfile {
  const bullets = draft.alignmentBullets
    .map((b) => b.trim())
    .filter((b) => b.length > 0);

  const pub = (on: boolean) => on !== false;

  return {
    id: user.id,
    displayName: user.displayName,
    age: user.age,
    city: pub(draft.locationPublic) ? draft.location.trim() : "",
    headline: headlineFromDraft(draft),
    bio: draft.bio.trim(),
    photos: user.photos,
    interestIds: [...draft.interests],
    verification: {
      phone: user.verification.phone,
      photo: user.verification.photo,
      id: user.verification.id,
    },
    jobTitle: pub(draft.jobTitlePublic) ? draft.jobTitle.trim() : "",
    companyName: pub(draft.companyNamePublic)
      ? draft.companyName.trim()
      : "",
    degree: pub(draft.degreePublic) ? draft.degree : "",
    schoolName: pub(draft.schoolNamePublic) ? draft.schoolName.trim() : "",
    hometown: pub(draft.hometownPublic) ? draft.hometown.trim() : "",
    height: pub(draft.heightPublic) ? draft.height.trim() : "",
    exercise: draft.exercise,
    drinking: draft.drinking,
    smoking: draft.smoking,
    zodiac: draft.zodiac,
    kids: draft.kids.trim(),
    haveKids: draft.haveKids,
    politics: draft.politics,
    religion: draft.religion,
    pronouns: draft.pronouns,
    languages: draft.languages.trim(),
    promptAnswer: draft.promptAnswer.trim(),
    intentions: intentionIdFromText(draft.preferences.intentions),
    compatibility: {
      scoreLabel: preview.previewMatchLabel,
      bullets:
        bullets.length > 0 ? bullets : [preview.previewPlaceholderBullet],
      whyThisMatch: preview.previewWhyMatch,
    },
  };
}
