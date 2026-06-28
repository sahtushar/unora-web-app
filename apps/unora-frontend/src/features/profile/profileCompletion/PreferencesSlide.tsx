import {Check, HeartHandshake, Users} from "lucide-react";

import {cn} from "@/lib/cn";

import {strings} from "../../strings";
import {
  type ProfilePreferencesDraft,
  SEEKING_VALUES,
} from "../profileCreationModel";
import type {CompletionDraft} from "./types";

const p = strings.profile;
const pc = strings.profile.profileCreation;

export function PreferencesSlide({
  draft,
  onPatchPreferences,
  onToggleSeeking,
}: {
  draft: CompletionDraft;
  onPatchPreferences: (partial: Partial<ProfilePreferencesDraft>) => void;
  onToggleSeeking: (value: string) => void;
}) {
  const intentionPresets = pc.preferences.intentionPresets as Record<
    string,
    string
  >;
  const seekingLabels = pc.seekingLabels;

  return (
    <div className="space-y-app-6">
      <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-unora-mist">
        <HeartHandshake className="h-3.5 w-3.5" />
        {pc.preferences.intentionsLabel}
      </p>

      <div className="space-y-app-4 rounded-3xl border border-unora-line/70 bg-white px-app-4 py-app-4 shadow-soft">
        <div className="space-y-app-3">
          {Object.entries(intentionPresets).map(([key, label]) => {
            const selected = draft.preferences.intentions === label;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onPatchPreferences({intentions: label})}
                className={cn(
                  "tap-highlight-none flex w-full items-center justify-between rounded-2xl border px-app-3 py-app-3.5 text-left text-lg font-medium leading-snug transition-all active:scale-[0.99]",
                  selected
                    ? "border-unora-brand-strong bg-unora-blush/55 text-unora-ink shadow-soft ring-1 ring-unora-brand/30"
                    : "border-unora-line/70 bg-unora-snow/20 text-unora-ink/85 hover:border-unora-line hover:bg-white"
                )}>
                <span>{label}</span>
                <span
                  className={cn(
                    "h-5 w-5 rounded-full border transition-colors",
                    selected
                      ? "border-unora-brand-strong bg-unora-brand-strong/90"
                      : "border-unora-line"
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-app-4 rounded-3xl border border-unora-line/70 bg-white px-app-4 py-app-4 shadow-soft">
        <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-unora-mist">
          <Users className="h-3.5 w-3.5" />
          {pc.preferences.seekingHint}
        </p>
        <div className="grid grid-cols-1 gap-2.5">
          {SEEKING_VALUES.map((val) => {
            const on = draft.preferences.seeking.includes(val);
            return (
              <button
                key={val}
                type="button"
                onClick={() => onToggleSeeking(val)}
                className={cn(
                  "tap-highlight-none inline-flex w-full items-center justify-between rounded-xl border px-app-3 py-app-3.5 text-left text-lg font-medium leading-snug transition-all active:scale-[0.99]",
                  on
                    ? "border-unora-brand-strong bg-unora-blush/45 text-unora-ink shadow-soft ring-1 ring-unora-brand/25"
                    : "border-unora-line/70 bg-unora-snow/30 text-unora-ink/80 hover:border-unora-line hover:bg-white"
                )}>
                <span>
                  {p.preferences.seekingPrefix} {seekingLabels[val]}
                </span>
                <span
                  className={cn(
                    "inline-flex h-4.5 w-4.5 items-center justify-center rounded-full border transition-colors",
                    on
                      ? "border-unora-brand-strong bg-unora-brand-strong text-white"
                      : "border-unora-line/80 bg-white"
                  )}>
                  {on ? <Check className="h-3 w-3" /> : null}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
