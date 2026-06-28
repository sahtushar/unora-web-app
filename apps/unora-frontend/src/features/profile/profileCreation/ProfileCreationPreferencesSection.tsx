import {SlidersHorizontal} from "lucide-react";

import {Card, Section} from "@/components/ui";
import {cn} from "@/lib/cn";

import {strings} from "../../strings";
import {PROFILE_CREATION_SECTION_IDS} from "../profileAnchors";
import type {ProfilePreferencesDraft} from "../profileCreationModel";
import {DATING_INTENTION_KEYS, SEEKING_VALUES} from "../profileCreationModel";
import {ProfileCreationAgeRangeSlider} from "./ProfileCreationAgeRangeSlider";
import {ProfileCreationDistanceSlider} from "./ProfileCreationDistanceSlider";
import {
  ProfileCreationSelectField,
  profileCreationSectionDividerClass,
} from "./ProfileCreationFields";

const p = strings.profile;
const pc = strings.profile.profileCreation;

function intentionKeyFromText(
  text: string,
  intentionPresetLabels: Record<string, string>
) {
  const t = text.trim();
  return (
    DATING_INTENTION_KEYS.find((k) => intentionPresetLabels[k] === t) ?? ""
  );
}

export function ProfileCreationPreferencesSection({
  preferences,
  busy = false,
  patchPreferences,
  toggleSeeking,
}: {
  preferences: ProfilePreferencesDraft;
  /** Soft top loader while a profile PATCH (e.g. saving preferences) is in flight. */
  busy?: boolean;
  patchPreferences: (partial: Partial<ProfilePreferencesDraft>) => void;
  toggleSeeking: (label: string) => void;
}) {
  const intentionPresets = pc.preferences.intentionPresets;
  const intentionPresetLabels = intentionPresets as Record<string, string>;
  const intentionSelectValue = intentionKeyFromText(
    preferences.intentions,
    intentionPresetLabels
  );
  const seekingLabels = pc.seekingLabels;
  const pref = preferences;

  return (
    <Section
      busy={busy}
      collapsible
      id={PROFILE_CREATION_SECTION_IDS.preferences}
      className={profileCreationSectionDividerClass}
      titleIcon={SlidersHorizontal}
      title={p.preferences.title}
      description={pc.preferences.hint}>
      <Card
        padded={false}
        className="overflow-hidden border-unora-line/60 bg-white text-sm shadow-none sm:shadow-soft">
        <div className="px-app-4 py-app-5 sm:px-app-6 sm:py-app-6">
          <p className="text-xs font-medium uppercase tracking-wide text-unora-mist">
            {pc.preferences.seekingHint}
          </p>
          <div className="mt-app-3 flex flex-wrap gap-2 sm:gap-app-2">
            {SEEKING_VALUES.map((val) => {
              const on = pref.seeking.includes(val);
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => toggleSeeking(val)}
                  className={cn(
                    "tap-highlight-none rounded-full border px-app-3 py-1.5 text-xs font-medium transition-colors active:scale-[0.98]",
                    on
                      ? "border-unora-line bg-unora-blush/45 text-unora-ink"
                      : "border-unora-line/50 bg-unora-cloud/40 text-unora-ink/65 hover:border-unora-line/80 hover:bg-unora-cloud/70 hover:text-unora-ink"
                  )}>
                  {p.preferences.seekingPrefix} {seekingLabels[val]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-unora-line/50 px-app-4 py-app-5 sm:px-app-6 sm:py-app-6">
          <p className="text-xs font-medium uppercase tracking-wide text-unora-mist">
            {pc.preferences.ageRangeTitle}
          </p>
          <div className="mt-app-3">
            <ProfileCreationAgeRangeSlider
              ageMax={pref.ageMax}
              ageMin={pref.ageMin}
              disabled={busy}
              legend={pc.preferences.ageRangeTitle}
              onChange={({ageMax, ageMin}) => {
                patchPreferences({ageMax, ageMin});
              }}
            />
            <label className="mt-app-5 flex cursor-pointer gap-app-3 tap-highlight-none">
              <input
                checked={pref.ageRangeStrict}
                className="mt-0.5 h-[18px] w-[18px] shrink-0 cursor-pointer rounded border-2 border-unora-ink/50 accent-unora-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-unora-brand/30 disabled:cursor-not-allowed"
                type="checkbox"
                disabled={busy}
                onChange={(e) => {
                  patchPreferences({ageRangeStrict: e.target.checked});
                }}
              />
              <div className="min-w-0 text-left text-sm text-unora-ink">
                {pc.preferences.ageRangeStrictLabel}
                <span className="mt-0.5 block text-xs font-normal leading-snug text-unora-mist">
                  {pc.preferences.ageRangeStrictHint}
                </span>
              </div>
            </label>
          </div>
          <div className="mt-app-6 w-full sm:max-w-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-unora-mist">
              {pc.preferences.distanceRangeTitle}
            </p>
            <div className="mt-app-3">
              <ProfileCreationDistanceSlider
                disabled={busy}
                distanceKm={pref.distanceKm}
                legend={pc.preferences.distanceRangeTitle}
                onChange={(km) => {
                  patchPreferences({distanceKm: km});
                }}
                valueLabel={pc.preferences.distanceSliderValue}
              />
            </div>
          </div>
          <p className="mt-app-4 text-sm tabular-nums leading-snug text-unora-ink/55">
            {p.preferences.ageDistance(
              pref.ageMin,
              pref.ageMax,
              pref.distanceKm
            )}
            {pref.ageRangeStrict
              ? ` ${pc.preferences.ageRangeStrictActiveHint}`
              : null}
          </p>
        </div>

        <div className="space-y-app-4 border-t border-unora-line/50 px-app-4 py-app-5 sm:px-app-6 sm:py-app-6">
          <p className="text-xs leading-relaxed text-unora-mist">
            {pc.preferences.intentionsPresetHint}
          </p>
          <ProfileCreationSelectField
            label={pc.preferences.intentionsLabel}
            value={intentionSelectValue}
            onChange={(key) => {
              if (!key) {
                return;
              }
              patchPreferences({
                intentions: intentionPresetLabels[key] ?? "",
              });
            }}
            optionKeys={DATING_INTENTION_KEYS as unknown as string[]}
            labels={intentionPresetLabels}
          />
        </div>
      </Card>
    </Section>
  );
}
