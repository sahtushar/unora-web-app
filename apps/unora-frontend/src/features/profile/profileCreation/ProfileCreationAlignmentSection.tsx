import {ListChecks} from "lucide-react";

import {Card, Section} from "@/components/ui";

import {strings} from "../../strings";
import {PROFILE_CREATION_SECTION_IDS} from "../profileAnchors";
import type {AlignmentBulletsTriple} from "../profileCreationModel";
import {
  ProfileCreationTextField,
  profileCreationSectionDividerClass,
} from "./ProfileCreationFields";

const pc = strings.profile.profileCreation;

const chipPreviewClass =
  "inline-flex items-center rounded-full bg-unora-cloud px-app-3 py-1.5 text-sm font-medium text-unora-ink ring-1 ring-unora-line/50";

export function ProfileCreationAlignmentSection({
  alignmentBullets,
  onPatch,
}: {
  alignmentBullets: AlignmentBulletsTriple;
  onPatch: (next: AlignmentBulletsTriple) => void;
}) {
  const preview = alignmentBullets.map((s) => s.trim()).filter(Boolean);

  const setLine = (index: 0 | 1 | 2, value: string) => {
    const next = alignmentBullets.map((v, i) =>
      i === index ? value : v
    ) as AlignmentBulletsTriple;
    onPatch(next);
  };

  return (
    <Section
      collapsible
      id={PROFILE_CREATION_SECTION_IDS.alignment}
      className={profileCreationSectionDividerClass}
      titleIcon={ListChecks}
      title={pc.alignment.title}
      description={pc.alignment.hint}>
      <Card className="border-unora-line/90 space-y-app-4">
        <div className="grid gap-app-3">
          <ProfileCreationTextField
            label={pc.alignment.line1Label}
            maxLength={72}
            placeholder={pc.alignment.placeholder}
            value={alignmentBullets[0]}
            onChange={(v) => setLine(0, v)}
          />
          <ProfileCreationTextField
            label={pc.alignment.line2Label}
            maxLength={72}
            placeholder={pc.alignment.placeholder}
            value={alignmentBullets[1]}
            onChange={(v) => setLine(1, v)}
          />
          <ProfileCreationTextField
            label={pc.alignment.line3Label}
            maxLength={72}
            placeholder={pc.alignment.placeholder}
            value={alignmentBullets[2]}
            onChange={(v) => setLine(2, v)}
          />
        </div>
        {preview.length > 0 ? (
          <div className="border-t border-unora-line/60 pt-app-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-unora-mist">
              {pc.alignment.previewLabel}
            </p>
            <div className="mt-app-2 flex flex-wrap gap-app-2">
              {preview.map((t, i) => (
                <span key={`${i}-${t}`} className={chipPreviewClass}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </Card>
    </Section>
  );
}
