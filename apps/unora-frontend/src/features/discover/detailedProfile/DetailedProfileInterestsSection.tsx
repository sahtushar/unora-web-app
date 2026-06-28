import {Heart} from "lucide-react";

import {MetadataChip} from "@/components/ui";

import {strings} from "../../strings";
import {interestIdsToInterestChips} from "../discoverInterestLabels";
import {
  DetailedProfileSection,
  DetailedProfileSectionHeading,
  detailedProfileSectionDividerClass,
} from "./DetailedProfileShared";
import {DETAILED_PROFILE_SECTION_IDS} from "./detailedProfileAnchors";

const s = strings.discover.detailedProfile;

export function DetailedProfileInterestsSection({
  interestIds,
}: {
  interestIds: readonly string[];
}) {
  const chips = interestIdsToInterestChips(interestIds);
  if (chips.length === 0) {
    return null;
  }

  return (
    <DetailedProfileSection
      id={DETAILED_PROFILE_SECTION_IDS.interests}
      className={detailedProfileSectionDividerClass}>
      <DetailedProfileSectionHeading icon={Heart}>
        {s.interestsTitle}
      </DetailedProfileSectionHeading>
      <div className="mt-app-3 flex flex-wrap gap-app-2">
        {chips.map(({id, label, icon}) => (
          <MetadataChip key={id} icon={icon} label={label} />
        ))}
      </div>
    </DetailedProfileSection>
  );
}
