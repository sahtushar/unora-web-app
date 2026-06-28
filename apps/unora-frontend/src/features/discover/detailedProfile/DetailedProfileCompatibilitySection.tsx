import {Gauge} from "lucide-react";

import type {CompatibilitySummary} from "@/types";

import {strings} from "../../strings";
import {
  DetailedProfileSection,
  DetailedProfileSectionHeading,
  detailedProfileSectionDividerClass,
} from "./DetailedProfileShared";
import {DETAILED_PROFILE_SECTION_IDS} from "./detailedProfileAnchors";

const s = strings.discover.detailedProfile;

export function DetailedProfileCompatibilitySection({
  compatibility,
}: {
  compatibility: CompatibilitySummary;
}) {
  return (
    <DetailedProfileSection
      id={DETAILED_PROFILE_SECTION_IDS.compatibility}
      className={detailedProfileSectionDividerClass}>
      <DetailedProfileSectionHeading icon={Gauge}>
        {s.compatibilityTitle}
      </DetailedProfileSectionHeading>
      <p className="mt-app-2 text-sm font-semibold text-unora-ink">
        {compatibility.scoreLabel}
      </p>
      <p className="mt-app-3 text-xs font-semibold uppercase tracking-wide text-unora-mist">
        {s.whyMatchLead}
      </p>
      <p className="mt-app-1 text-sm leading-relaxed text-unora-mist">
        {compatibility.whyThisMatch}
      </p>
    </DetailedProfileSection>
  );
}
