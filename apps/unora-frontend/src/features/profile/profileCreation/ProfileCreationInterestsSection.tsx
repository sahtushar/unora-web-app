import {ChevronRight, Heart} from "lucide-react";
import {Link} from "react-router-dom";

import {Card, Section} from "@/components/ui";
import {routes} from "@/lib/routes";

import {strings} from "../../strings";
import {getCatalogInterest} from "../interestCatalog";
import {PROFILE_CREATION_SECTION_IDS} from "../profileAnchors";
import {profileCreationSectionDividerClass} from "./ProfileCreationFields";

const pc = strings.profile.profileCreation;

export function ProfileCreationInterestsSection({
  interestIds,
  busy = false,
}: {
  interestIds: readonly string[];
  /** Soft top loader while `PATCH` interests is in flight. */
  busy?: boolean;
}) {
  const interestLabels = pc.interestLabels;

  return (
    <Section
      busy={busy}
      collapsible
      id={PROFILE_CREATION_SECTION_IDS.interests}
      className={profileCreationSectionDividerClass}
      titleIcon={Heart}
      title={pc.interests.title}
      description={pc.interests.hint}>
      <Link
        to={routes.profileEditInterests}
        className="tap-highlight-none block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-unora-brand-strong/35">
        <Card className="border-unora-line/90 transition-colors hover:border-unora-brand-strong/25 hover:shadow-soft">
          <p className="text-xs leading-relaxed text-unora-mist">
            {pc.interests.minNote}
          </p>
          <p className="mt-app-2 text-xs leading-relaxed text-unora-mist">
            {pc.interests.pickerHint}
          </p>
          <div className="mt-app-4 flex min-h-[2.75rem] flex-wrap content-start gap-app-2">
            {interestIds.length === 0 ? (
              <span className="text-sm text-unora-mist/90">
                {pc.interests.emptySelection}
              </span>
            ) : (
              interestIds.map((id) => {
                const fromCatalog = getCatalogInterest(id);
                const label =
                  fromCatalog?.label ??
                  interestLabels[id as keyof typeof interestLabels] ??
                  id;
                const icon = fromCatalog?.icon ?? "✦";
                return (
                  <span
                    key={id}
                    className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-unora-line/90 bg-unora-cloud/60 px-app-3 py-1.5 text-xs font-medium text-unora-ink">
                    <span aria-hidden>{icon}</span>
                    <span className="min-w-0 truncate">{label}</span>
                  </span>
                );
              })
            )}
          </div>
          <div className="mt-app-4 flex items-center justify-between gap-app-3 border-t border-unora-line/70 pt-app-4 text-sm font-semibold text-unora-brand-strong">
            <span>{pc.interests.openPicker}</span>
            <ChevronRight
              className="h-5 w-5 shrink-0 text-unora-brand-strong"
              aria-hidden
            />
          </div>
        </Card>
      </Link>
    </Section>
  );
}
