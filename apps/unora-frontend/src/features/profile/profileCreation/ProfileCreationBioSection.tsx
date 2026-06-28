import {UserRound} from "lucide-react";

import {Card, Section} from "@/components/ui";
import {cn} from "@/lib/cn";

import {strings} from "../../strings";
import {PROFILE_CREATION_SECTION_IDS} from "../profileAnchors";
import {
  profileCreationFieldInputClass,
  profileCreationSectionDividerClass,
} from "./ProfileCreationFields";

const pc = strings.profile.profileCreation;

export function ProfileCreationBioSection({
  bio,
  onBioChange,
}: {
  bio: string;
  onBioChange: (bio: string) => void;
}) {
  return (
    <Section
      collapsible
      id={PROFILE_CREATION_SECTION_IDS.bio}
      className={profileCreationSectionDividerClass}
      titleIcon={UserRound}
      title={pc.bio.title}
      description={pc.bio.hint}>
      <Card className="border-unora-line/90">
        <label className="block">
          <span className="sr-only">{pc.bio.title}</span>
          <textarea
            value={bio}
            onChange={(e) => onBioChange(e.target.value)}
            rows={5}
            placeholder={pc.bio.placeholder}
            className={cn(
              profileCreationFieldInputClass,
              "min-h-[7.5rem] resize-y tap-highlight-none leading-relaxed"
            )}
          />
        </label>
      </Card>
    </Section>
  );
}
