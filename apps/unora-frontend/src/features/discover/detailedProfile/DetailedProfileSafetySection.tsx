import {Shield} from "lucide-react";

import {strings} from "../../strings";
import {
  DetailedProfileSection,
  DetailedProfileSectionHeading,
  detailedProfileSectionDividerClass,
} from "./DetailedProfileShared";
import {DETAILED_PROFILE_SECTION_IDS} from "./detailedProfileAnchors";

const s = strings.discover.detailedProfile;

export function DetailedProfileSafetySection() {
  return (
    <DetailedProfileSection
      id={DETAILED_PROFILE_SECTION_IDS.safety}
      className={detailedProfileSectionDividerClass}>
      <DetailedProfileSectionHeading icon={Shield}>
        {s.safetyTitle}
      </DetailedProfileSectionHeading>
      <div className="mt-app-3 flex flex-wrap items-center justify-center gap-app-6 text-sm font-semibold">
        <button
          type="button"
          className="tap-highlight-none text-unora-ink transition-colors hover:text-unora-mist">
          {s.block}
        </button>
        <button
          type="button"
          className="tap-highlight-none text-unora-brand-strong transition-colors hover:text-unora-ink">
          {s.report}
        </button>
      </div>
      <p className="mt-app-4 text-center text-[11px] leading-relaxed text-unora-mist">
        {s.safetyFootnote}
      </p>
    </DetailedProfileSection>
  );
}
