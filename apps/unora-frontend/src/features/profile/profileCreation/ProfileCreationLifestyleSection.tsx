import {Activity} from "lucide-react";

import {Card, Section} from "@/components/ui";
import type {
  HaveKidsOptionId,
  PoliticsOptionId,
  PronounsOptionId,
  ReligionOptionId,
} from "@/types";

import {strings} from "../../strings";
import {PROFILE_CREATION_SECTION_IDS} from "../profileAnchors";
import type {ProfileCreationDraft} from "../profileCreationModel";
import {
  DRINKING_VALUES,
  EXERCISE_VALUES,
  HAVE_KIDS_VALUES,
  POLITICS_VALUES,
  PRONOUNS_VALUES,
  RELIGION_VALUES,
  SMOKING_VALUES,
  ZODIAC_VALUES,
} from "../profileCreationModel";
import {
  ProfileCreationLanguagesField,
  ProfileCreationSelectField,
  ProfileCreationTextField,
  profileCreationSectionDividerClass,
} from "./ProfileCreationFields";

const pc = strings.profile.profileCreation;
const f = pc.fields;
const opt = pc.selectOptions;

type LifestylePatch = Pick<
  ProfileCreationDraft,
  | "exercise"
  | "drinking"
  | "smoking"
  | "zodiac"
  | "kids"
  | "haveKids"
  | "politics"
  | "religion"
  | "pronouns"
  | "languages"
>;

export function ProfileCreationLifestyleSection({
  draftSlice,
  onPatch,
}: {
  draftSlice: LifestylePatch;
  onPatch: (partial: Partial<LifestylePatch>) => void;
}) {
  return (
    <Section
      collapsible
      id={PROFILE_CREATION_SECTION_IDS.lifestyle}
      className={profileCreationSectionDividerClass}
      titleIcon={Activity}
      title={pc.lifestyle.title}
      description={pc.lifestyle.hint}>
      <Card className="border-unora-line/90">
        <div className="grid gap-app-3 sm:grid-cols-2">
          <ProfileCreationSelectField
            label={f.exercise}
            value={draftSlice.exercise}
            onChange={(exercise) => onPatch({exercise})}
            optionKeys={EXERCISE_VALUES as unknown as string[]}
            labels={opt.exercise as Record<string, string>}
          />
          <ProfileCreationSelectField
            label={f.drinking}
            value={draftSlice.drinking}
            onChange={(drinking) => onPatch({drinking})}
            optionKeys={DRINKING_VALUES as unknown as string[]}
            labels={opt.drinking as Record<string, string>}
          />
          <ProfileCreationSelectField
            label={f.smoking}
            value={draftSlice.smoking}
            onChange={(smoking) => onPatch({smoking})}
            optionKeys={SMOKING_VALUES as unknown as string[]}
            labels={opt.smoking as Record<string, string>}
          />
          <ProfileCreationSelectField
            label={f.zodiac}
            value={draftSlice.zodiac}
            onChange={(zodiac) => onPatch({zodiac})}
            optionKeys={ZODIAC_VALUES as unknown as string[]}
            labels={opt.zodiac as Record<string, string>}
          />
          <ProfileCreationTextField
            label={f.kids}
            value={draftSlice.kids}
            onChange={(kids) => onPatch({kids})}
            placeholder={f.placeholderShort}
          />
          <ProfileCreationSelectField
            label={f.haveKids}
            value={draftSlice.haveKids}
            onChange={(v) => onPatch({haveKids: v as HaveKidsOptionId | ""})}
            optionKeys={HAVE_KIDS_VALUES as unknown as string[]}
            labels={opt.haveKids as Record<string, string>}
          />
          <ProfileCreationSelectField
            label={f.politics}
            value={draftSlice.politics}
            onChange={(v) => onPatch({politics: v as PoliticsOptionId | ""})}
            optionKeys={POLITICS_VALUES as unknown as string[]}
            labels={opt.politics as Record<string, string>}
          />
          <ProfileCreationSelectField
            label={f.religion}
            value={draftSlice.religion}
            onChange={(v) => onPatch({religion: v as ReligionOptionId | ""})}
            optionKeys={RELIGION_VALUES as unknown as string[]}
            labels={opt.religion as Record<string, string>}
          />
          <ProfileCreationSelectField
            label={f.pronouns}
            value={draftSlice.pronouns}
            onChange={(v) => onPatch({pronouns: v as PronounsOptionId | ""})}
            optionKeys={PRONOUNS_VALUES as unknown as string[]}
            labels={opt.pronouns as Record<string, string>}
          />
          <div className="sm:col-span-2">
            <ProfileCreationLanguagesField
              label={f.languages}
              value={draftSlice.languages}
              onChange={(languages) => onPatch({languages})}
            />
          </div>
        </div>
      </Card>
    </Section>
  );
}
