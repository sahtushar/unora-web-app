import type {LucideIcon} from "lucide-react";
import {
  Activity,
  Baby,
  BookOpen,
  Cigarette,
  Dumbbell,
  Languages,
  Moon,
  UserRound,
  Users,
  Vote,
  Wine,
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
const opt = pc.selectOptions;

function labelFor(
  group:
    | "drinking"
    | "exercise"
    | "haveKids"
    | "politics"
    | "pronouns"
    | "religion"
    | "smoking"
    | "zodiac",
  key: string
): string {
  if (!key.trim()) {
    return "";
  }
  const map = opt[group] as Record<string, string>;
  return map[key] ?? key;
}

export function DetailedProfileLifestyleSection({
  exercise,
  drinking,
  smoking,
  zodiac,
  kids,
  haveKids,
  politics,
  religion,
  pronouns,
  languages,
}: {
  drinking: string;
  exercise: string;
  haveKids: string;
  kids: string;
  languages: string;
  politics: string;
  pronouns: string;
  religion: string;
  smoking: string;
  zodiac: string;
}) {
  const rows: {icon: LucideIcon; label: string; value: string}[] = [];

  const ex = labelFor("exercise", exercise);
  if (ex) {
    rows.push({icon: Dumbbell, label: f.exercise, value: ex});
  }
  const dr = labelFor("drinking", drinking);
  if (dr) {
    rows.push({icon: Wine, label: f.drinking, value: dr});
  }
  const sm = labelFor("smoking", smoking);
  if (sm) {
    rows.push({icon: Cigarette, label: f.smoking, value: sm});
  }
  const zo = labelFor("zodiac", zodiac);
  if (zo) {
    rows.push({icon: Moon, label: f.zodiac, value: zo});
  }
  if (kids.trim()) {
    rows.push({icon: Baby, label: f.kids, value: kids.trim()});
  }
  const hk = labelFor("haveKids", haveKids);
  if (hk) {
    rows.push({icon: Users, label: f.haveKids, value: hk});
  }
  const po = labelFor("politics", politics);
  if (po) {
    rows.push({icon: Vote, label: f.politics, value: po});
  }
  const re = labelFor("religion", religion);
  if (re) {
    rows.push({icon: BookOpen, label: f.religion, value: re});
  }
  const pr = labelFor("pronouns", pronouns);
  if (pr) {
    rows.push({icon: UserRound, label: f.pronouns, value: pr});
  }
  if (languages.trim()) {
    rows.push({icon: Languages, label: f.languages, value: languages.trim()});
  }

  if (rows.length === 0) {
    return null;
  }

  return (
    <DetailedProfileSection
      id={DETAILED_PROFILE_SECTION_IDS.lifestyle}
      className={detailedProfileSectionDividerClass}>
      <DetailedProfileSectionHeading icon={Activity}>
        {pc.lifestyle.title}
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
