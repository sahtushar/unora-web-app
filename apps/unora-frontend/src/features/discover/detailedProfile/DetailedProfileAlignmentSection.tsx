import {ListChecks} from "lucide-react";

import {strings} from "../../strings";
import {
  DetailedProfileChip,
  DetailedProfileSection,
  DetailedProfileSectionHeading,
  detailedProfileSectionDividerClass,
} from "./DetailedProfileShared";
import {DETAILED_PROFILE_SECTION_IDS} from "./detailedProfileAnchors";

const s = strings.discover.detailedProfile;

export function DetailedProfileAlignmentSection({
  bullets,
}: {
  bullets: readonly string[];
}) {
  return (
    <DetailedProfileSection
      id={DETAILED_PROFILE_SECTION_IDS.alignment}
      className={detailedProfileSectionDividerClass}>
      <DetailedProfileSectionHeading icon={ListChecks}>
        {s.alignmentTitle}
      </DetailedProfileSectionHeading>
      <div className="mt-app-3 flex flex-wrap gap-app-2">
        {bullets.map((t) => (
          <DetailedProfileChip key={t}>{t}</DetailedProfileChip>
        ))}
      </div>
    </DetailedProfileSection>
  );
}
