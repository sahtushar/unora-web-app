import type {ReactNode} from "react";

import {Briefcase, Compass, Globe, GraduationCap, MapPin} from "lucide-react";

import type {DatingIntentionPresetId, DiscoverProfile} from "@/types";

const chipIconClass = "h-3.5 w-3.5 shrink-0 text-unora-ink/70";

export type ProfileCardMetadataChip = {
  icon: ReactNode;
  key: string;
  label: string;
};

/**
 * Three logical rows for the discover card: intentions → locale → work/education.
 * Empty rows are omitted; callers render each non-empty row as a flex wrap line.
 */
export function buildProfileCardMetadataRows(
  profile: DiscoverProfile,
  degreeLabelMap: Record<string, string>,
  intentionPresetLabels: Record<DatingIntentionPresetId, string>
): ProfileCardMetadataChip[][] {
  const rows: ProfileCardMetadataChip[][] = [];

  const intentionLabel =
    intentionPresetLabels[profile.intentions] ?? profile.intentions;
  rows.push([
    {
      icon: (
        <Compass className={chipIconClass} strokeWidth={1.75} aria-hidden />
      ),
      key: "intentions",
      label: intentionLabel,
    },
  ]);

  const localeRow: ProfileCardMetadataChip[] = [];
  const lang = profile.languages.trim();
  if (lang) {
    localeRow.push({
      icon: <Globe className={chipIconClass} strokeWidth={1.75} aria-hidden />,
      key: "languages",
      label: lang,
    });
  }
  const city = profile.city.trim();
  if (city) {
    localeRow.push({
      icon: <MapPin className={chipIconClass} strokeWidth={1.75} aria-hidden />,
      key: "city",
      label: city,
    });
  }
  if (localeRow.length > 0) {
    rows.push(localeRow);
  }

  const workRow: ProfileCardMetadataChip[] = [];
  const job = profile.jobTitle.trim();
  if (job) {
    workRow.push({
      icon: (
        <Briefcase className={chipIconClass} strokeWidth={1.75} aria-hidden />
      ),
      key: "jobTitle",
      label: job,
    });
  }
  const degreeKey = profile.degree.trim();
  const degreeLabel = degreeKey ? (degreeLabelMap[degreeKey] ?? degreeKey) : "";
  if (degreeLabel) {
    workRow.push({
      icon: (
        <GraduationCap
          className={chipIconClass}
          strokeWidth={1.75}
          aria-hidden
        />
      ),
      key: "degree",
      label: degreeLabel,
    });
  }
  if (workRow.length > 0) {
    rows.push(workRow);
  }

  return rows;
}
