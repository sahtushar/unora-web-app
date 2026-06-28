import type {LucideIcon} from "lucide-react";
import {
  Briefcase,
  Building2,
  GraduationCap,
  Home,
  MapPin,
  Ruler,
  School,
} from "lucide-react";

import {cn} from "@/lib/cn";

import {strings} from "../../strings";
import {
  DetailedProfileSection,
  DetailedProfileSectionHeading,
  detailedProfileSectionDividerClass,
} from "./DetailedProfileShared";
import {DETAILED_PROFILE_SECTION_IDS} from "./detailedProfileAnchors";

const pc = strings.profile.profileCreation;
const f = pc.fields;
const degreeLabels = pc.selectOptions.degree as Record<string, string>;

export function DetailedProfileBasicsSection({
  city,
  jobTitle,
  companyName,
  degree,
  schoolName,
  hometown,
  height,
}: {
  city: string;
  companyName: string;
  degree: string;
  height: string;
  hometown: string;
  jobTitle: string;
  schoolName: string;
}) {
  const degreeDisplay = degree.trim() ? (degreeLabels[degree] ?? degree) : "";

  const heightDisplay = height.trim() ? `${height.trim()} cm` : "";

  const rows: {icon: LucideIcon; label: string; value: string}[] = [];
  if (jobTitle.trim()) {
    rows.push({icon: Briefcase, label: f.jobTitle, value: jobTitle.trim()});
  }
  if (companyName.trim()) {
    rows.push({
      icon: Building2,
      label: f.companyName,
      value: companyName.trim(),
    });
  }
  if (degreeDisplay) {
    rows.push({icon: GraduationCap, label: f.degree, value: degreeDisplay});
  }
  if (schoolName.trim()) {
    rows.push({icon: School, label: f.schoolName, value: schoolName.trim()});
  }
  if (city.trim()) {
    rows.push({icon: MapPin, label: f.location, value: city.trim()});
  }
  if (hometown.trim()) {
    rows.push({icon: Home, label: f.hometown, value: hometown.trim()});
  }
  if (heightDisplay) {
    rows.push({icon: Ruler, label: f.height, value: heightDisplay});
  }

  if (rows.length === 0) {
    return null;
  }

  return (
    <DetailedProfileSection
      id={DETAILED_PROFILE_SECTION_IDS.basics}
      className={detailedProfileSectionDividerClass}>
      <DetailedProfileSectionHeading icon={Briefcase}>
        {pc.basics.title}
      </DetailedProfileSectionHeading>
      <dl className="mt-app-3">
        {rows.map(({icon: Icon, label, value}, index) => (
          <div key={label} className="flex items-center gap-app-4">
            <Icon
              aria-hidden
              className="shrink-0 text-unora-ink"
              size={20}
              strokeWidth={1.5}
            />
            <div
              className={cn(
                "min-w-0 flex-1 py-app-3",
                index < rows.length - 1 && "border-b border-unora-line/50"
              )}>
              <dt className="sr-only">{label}</dt>
              <dd className="text-base font-medium leading-snug text-unora-ink">
                {value}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </DetailedProfileSection>
  );
}
