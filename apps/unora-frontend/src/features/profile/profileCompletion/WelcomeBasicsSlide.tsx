import {useState} from "react";

import {
  CalendarDays,
  Check,
  CircleHelp,
  LockKeyhole,
  type LucideIcon,
  Mars,
  NonBinary,
  UserRound,
  Venus,
  VenusAndMars,
} from "lucide-react";

import {cn} from "@/lib/cn";
import type {GenderPresentation} from "@/types";

import {strings} from "../../strings";
import type {CompletionDraft} from "./types";

const f = strings.profile.profileCompletionFlow.slides.welcome.fields;
const GENDER_OPTIONS: Array<{
  icon: LucideIcon;
  label: string;
  value: GenderPresentation;
}> = [
  {icon: Venus, label: f.genderOptions.woman, value: "woman"},
  {icon: Mars, label: f.genderOptions.man, value: "man"},
  {icon: NonBinary, label: f.genderOptions.nonbinary, value: "nonbinary"},
  {
    icon: CircleHelp,
    label: f.genderOptions.preferNotToSay,
    value: "prefer_not_say",
  },
];

export function WelcomeBasicsSlide({
  draft,
  onPatch,
}: {
  draft: CompletionDraft;
  onPatch: (partial: Partial<CompletionDraft>) => void;
}) {
  const [dobFocused, setDobFocused] = useState(false);
  const showDateInput = dobFocused || draft.dateOfBirth.trim().length > 0;

  return (
    <div className="space-y-app-6">
      <div className="rounded-3xl border border-unora-line/70 bg-white px-app-4 py-app-4 shadow-soft">
        <label className="block">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-unora-mist">
            <UserRound className="h-3.5 w-3.5" />
            {f.firstName}
          </span>
          <input
            type="text"
            autoComplete="given-name"
            onChange={(e) => onPatch({firstName: e.target.value})}
            className="mt-app-2 w-full border-b border-unora-line/80 px-0 pb-app-2 pt-1 text-[2rem] font-display leading-tight text-unora-ink outline-none transition focus:border-unora-brand-strong"
            placeholder={f.firstNamePlaceholder}
            value={draft.firstName}
          />
        </label>

        <label className="mt-app-4 block">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-unora-mist">
            <UserRound className="h-3.5 w-3.5" />
            {f.lastName}
          </span>
          <input
            type="text"
            autoComplete="family-name"
            value={draft.lastName}
            onChange={(e) => onPatch({lastName: e.target.value})}
            className="mt-app-2 w-full border-b border-unora-line/70 px-0 pb-app-2 pt-1 text-lg text-unora-ink outline-none transition focus:border-unora-brand-strong"
            placeholder={f.lastNamePlaceholder}
          />
          <p className="mt-2 inline-flex items-start gap-1.5 text-xs leading-relaxed text-unora-mist">
            <LockKeyhole className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{f.lastNamePrivacy}</span>
          </p>
        </label>
      </div>

      <div className="space-y-app-4 rounded-3xl border border-unora-line/70 bg-white px-app-4 py-app-4 shadow-soft">
        <label className="block">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-unora-mist">
            <CalendarDays className="h-3.5 w-3.5" />
            {f.dateOfBirth}
          </span>
          <input
            type={showDateInput ? "date" : "text"}
            value={draft.dateOfBirth}
            onChange={(e) => onPatch({dateOfBirth: e.target.value})}
            onFocus={() => setDobFocused(true)}
            onBlur={() => setDobFocused(false)}
            placeholder={f.dateOfBirthPlaceholder}
            inputMode={showDateInput ? undefined : "numeric"}
            className="mt-app-2 w-full rounded-2xl border border-unora-line/80 bg-unora-snow/35 px-app-3 py-app-3 text-base text-unora-ink outline-none transition focus:border-unora-brand-strong"
          />
        </label>

        <div className="h-px w-full bg-unora-line/50" />

        <div className="space-y-app-3">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-unora-mist">
            <VenusAndMars className="h-3.5 w-3.5" />
            {f.gender}
          </p>
          <div className="grid grid-cols-1 gap-2.5 min-[380px]:grid-cols-2">
            {GENDER_OPTIONS.map((option) => {
              const on = draft.gender === option.value;
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onPatch({gender: option.value})}
                  className={cn(
                    "tap-highlight-none grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-xl border px-app-3 py-app-2.5 text-left text-[0.92rem] font-medium leading-tight transition-all active:scale-[0.99] sm:text-sm min-h-[2rem]",
                    on
                      ? "border-unora-brand-strong bg-unora-blush/55 text-unora-ink shadow-soft ring-1 ring-unora-brand/30"
                      : "border-unora-line/70 bg-unora-snow/30 text-unora-ink/85 hover:border-unora-line hover:bg-white"
                  )}>
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      on ? "text-unora-brand-strong" : "text-unora-mist"
                    )}
                    aria-hidden
                  />
                  <span className="min-w-0 pr-1">{option.label}</span>
                  <span
                    className={cn(
                      "inline-flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border transition-colors",
                      on
                        ? "border-unora-brand-strong bg-unora-brand-strong text-white"
                        : "border-unora-line/80 text-transparent"
                    )}>
                    <Check className="h-3 w-3" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
