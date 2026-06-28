import {MapPin} from "lucide-react";

import {strings} from "../../strings";
import {IconPin} from "../components/discoverIcons";
import {
  DetailedProfileChip,
  DetailedProfileSection,
  DetailedProfileSectionHeading,
  detailedProfileSectionDividerClass,
} from "./DetailedProfileShared";
import {DETAILED_PROFILE_SECTION_IDS} from "./detailedProfileAnchors";

const s = strings.discover.detailedProfile;

export function DetailedProfileLocationSection({
  city,
  hometown,
}: {
  city: string;
  hometown?: string;
}) {
  const home = hometown?.trim() ?? "";

  return (
    <DetailedProfileSection
      id={DETAILED_PROFILE_SECTION_IDS.location}
      className={detailedProfileSectionDividerClass}>
      <DetailedProfileSectionHeading icon={MapPin}>
        {s.locationTitle}
      </DetailedProfileSectionHeading>
      <div className="mt-app-3 flex items-start gap-app-2 text-sm text-unora-ink">
        <IconPin className="mt-0.5 shrink-0 text-unora-brand-strong" />
        <div>
          <p className="font-medium">{city}</p>
          {home ? (
            <p className="mt-app-1 text-sm text-unora-mist">
              {s.hometownLine(home)}
            </p>
          ) : null}
          <p className="mt-0.5 text-xs text-unora-mist">{s.nearYouHint}</p>
        </div>
      </div>
      <div className="mt-app-3 flex flex-wrap gap-app-2">
        <DetailedProfileChip>{s.basedIn(city)}</DetailedProfileChip>
        <DetailedProfileChip>{s.aroundCity(city)}</DetailedProfileChip>
      </div>
    </DetailedProfileSection>
  );
}
