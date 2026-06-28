import {Briefcase} from "lucide-react";

import {Card, Section} from "@/components/ui";

import {strings} from "../../strings";
import {LocationFieldTrigger} from "../CityLocationPicker";
import {PROFILE_CREATION_SECTION_IDS} from "../profileAnchors";
import type {ProfileBasicsDraftSlice} from "../profileCreationModel";
import {DEGREE_VALUES} from "../profileCreationModel";
import {
  ProfileCreationSelectField,
  ProfileCreationTextField,
  profileCreationSectionDividerClass,
} from "./ProfileCreationFields";

const pc = strings.profile.profileCreation;
const f = pc.fields;
const opt = pc.selectOptions;

export function ProfileCreationBasicsSection({
  busy = false,
  companyName,
  companyNamePublic,
  degree,
  degreePublic,
  height,
  heightPublic,
  hometown,
  hometownPublic,
  jobTitle,
  jobTitlePublic,
  location,
  locationPublic,
  schoolName,
  schoolNamePublic,
  onBasicsDraftPatch,
  onBasicsSyncToServer,
  onOpenCityPicker,
}: {
  busy?: boolean;
  companyName: string;
  companyNamePublic: boolean;
  degree: string;
  degreePublic: boolean;
  height: string;
  heightPublic: boolean;
  hometown: string;
  hometownPublic: boolean;
  jobTitle: string;
  jobTitlePublic: boolean;
  location: string;
  locationPublic: boolean;
  schoolName: string;
  schoolNamePublic: boolean;
  onBasicsDraftPatch: (partial: Partial<ProfileBasicsDraftSlice>) => void;
  onBasicsSyncToServer: (partial: Partial<ProfileBasicsDraftSlice>) => void;
  onOpenCityPicker: () => void;
}) {
  const showPublic = pc.basics.showPublicly;

  return (
    <Section
      busy={busy}
      collapsible
      id={PROFILE_CREATION_SECTION_IDS.basics}
      className={profileCreationSectionDividerClass}
      titleIcon={Briefcase}
      title={pc.basics.title}
      description={pc.basics.hint}>
      <Card className="border-unora-line/90">
        <div className="grid gap-app-3 sm:grid-cols-2">
          <ProfileCreationTextField
            label={f.jobTitle}
            placeholder={f.placeholderShort}
            publicToggle={{
              checked: jobTitlePublic,
              helperText: showPublic,
              onChange: (v) => onBasicsSyncToServer({jobTitlePublic: v}),
            }}
            value={jobTitle}
            onBlurCommitValue={(v) => onBasicsSyncToServer({jobTitle: v})}
            onChange={(v) => onBasicsDraftPatch({jobTitle: v})}
          />
          <ProfileCreationTextField
            label={f.companyName}
            placeholder={f.placeholderShort}
            publicToggle={{
              checked: companyNamePublic,
              helperText: showPublic,
              onChange: (v) => onBasicsSyncToServer({companyNamePublic: v}),
            }}
            value={companyName}
            onBlurCommitValue={(v) => onBasicsSyncToServer({companyName: v})}
            onChange={(v) => onBasicsDraftPatch({companyName: v})}
          />
          <ProfileCreationSelectField
            label={f.degree}
            labels={opt.degree as Record<string, string>}
            optionKeys={DEGREE_VALUES as unknown as string[]}
            publicToggle={{
              checked: degreePublic,
              helperText: showPublic,
              onChange: (v) => onBasicsSyncToServer({degreePublic: v}),
            }}
            value={degree}
            onChange={(v) => onBasicsSyncToServer({degree: v})}
          />
          <ProfileCreationTextField
            label={f.schoolName}
            placeholder={f.placeholderShort}
            publicToggle={{
              checked: schoolNamePublic,
              helperText: showPublic,
              onChange: (v) => onBasicsSyncToServer({schoolNamePublic: v}),
            }}
            value={schoolName}
            onBlurCommitValue={(v) => onBasicsSyncToServer({schoolName: v})}
            onChange={(v) => onBasicsDraftPatch({schoolName: v})}
          />
          <LocationFieldTrigger
            className="sm:col-span-2"
            label={f.location}
            placeholder={f.placeholderShort}
            publicToggle={{
              checked: locationPublic,
              helperText: showPublic,
              onChange: (v) => onBasicsSyncToServer({locationPublic: v}),
            }}
            value={location}
            onOpen={onOpenCityPicker}
          />
          <div className="sm:col-span-2">
            <ProfileCreationTextField
              label={f.hometown}
              placeholder={f.placeholderShort}
              publicToggle={{
                checked: hometownPublic,
                helperText: showPublic,
                onChange: (v) => onBasicsSyncToServer({hometownPublic: v}),
              }}
              value={hometown}
              onBlurCommitValue={(v) => onBasicsSyncToServer({hometown: v})}
              onChange={(v) => onBasicsDraftPatch({hometown: v})}
            />
          </div>
          <ProfileCreationTextField
            label={f.height}
            placeholder={f.placeholderShort}
            digitsOnly
            maxLength={3}
            publicToggle={{
              checked: heightPublic,
              helperText: showPublic,
              onChange: (v) => onBasicsSyncToServer({heightPublic: v}),
            }}
            value={height}
            onBlurCommitValue={(v) => onBasicsSyncToServer({height: v})}
            onChange={(v) => onBasicsDraftPatch({height: v})}
          />
        </div>
      </Card>
    </Section>
  );
}
