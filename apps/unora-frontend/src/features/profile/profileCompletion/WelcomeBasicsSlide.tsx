import {useCallback, useState} from "react";

import {useQueryClient} from "@tanstack/react-query";
import {
  CalendarDays,
  Check,
  CircleHelp,
  LocateFixed,
  LockKeyhole,
  type LucideIcon,
  MapPin,
  Mars,
  NonBinary,
  UserRound,
  Venus,
  VenusAndMars,
} from "lucide-react";

import {Button, Modal} from "@/components/ui";
import {cn} from "@/lib/cn";
import {syncBrowserLocationToProfile} from "@/lib/syncBrowserLocation";
import {queryKeys} from "@/services/queryKeys";
import type {
  CurrentUserProfile,
  GenderPresentation,
  UserLocationDetails,
} from "@/types";

import {strings} from "../../strings";
import type {CompletionDraft} from "./types";

const welcome = strings.profile.profileCompletionFlow.slides.welcome;
const f = welcome.fields;
const locationPrompt = welcome.locationPrompt;
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

function isGeolocationError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error;
}

export function WelcomeBasicsSlide({
  draft,
  onPatch,
  locationEnabled,
  onLocationSynced,
}: {
  draft: CompletionDraft;
  onPatch: (partial: Partial<CompletionDraft>) => void;
  locationEnabled: boolean;
  onLocationSynced: (userLocation: UserLocationDetails) => void;
}) {
  const queryClient = useQueryClient();
  const [dobFocused, setDobFocused] = useState(false);
  const [locationPromptOpen, setLocationPromptOpen] = useState(
    () => !locationEnabled
  );
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationSubmitting, setLocationSubmitting] = useState(false);
  const showDateInput = dobFocused || draft.dateOfBirth.trim().length > 0;

  const closeLocationPrompt = useCallback(() => {
    setLocationPromptOpen(false);
  }, []);

  const handleEnableLocation = useCallback(async () => {
    if (!("geolocation" in globalThis.navigator)) {
      setLocationError(locationPrompt.unsupported);
      return;
    }
    if (locationSubmitting) {
      return;
    }

    setLocationSubmitting(true);
    setLocationError(null);

    try {
      const result = await syncBrowserLocationToProfile();
      queryClient.setQueryData<CurrentUserProfile>(
        queryKeys.currentUser,
        (prev) =>
          prev === undefined
            ? prev
            : {
                ...prev,
                location: result.location,
                userLocation: result.userLocation,
              }
      );
      onLocationSynced(result.userLocation);
      closeLocationPrompt();
    } catch (error) {
      setLocationError(
        isGeolocationError(error)
          ? locationPrompt.error
          : locationPrompt.saveError
      );
    } finally {
      setLocationSubmitting(false);
    }
  }, [
    closeLocationPrompt,
    locationSubmitting,
    onLocationSynced,
    queryClient,
  ]);

  const locationPromptTitle = (
    <span className="flex items-start gap-app-2">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-unora-line/85 bg-unora-cloud/70 text-unora-brand-strong shadow-soft">
        <MapPin className="h-5 w-5" strokeWidth={1.85} aria-hidden />
      </span>
      <span className="min-w-0 pt-0.5">{locationPrompt.title}</span>
    </span>
  );

  return (
    <>
      <Modal
        open={locationPromptOpen}
        onClose={() => {}}
        title={locationPromptTitle}
        description={
          <div className="space-y-app-3">
            <p>{locationPrompt.description}</p>
            {locationError === null ? null : (
              <p className="rounded-xl border border-red-200 bg-red-50 px-app-3 py-app-2 text-sm font-medium text-red-800">
                {locationError}
              </p>
            )}
          </div>
        }
        backdropDismissAriaLabel={locationPrompt.backdropDismissAria}
        closeAriaLabel={null}
        className="border-unora-line/95 bg-gradient-to-b from-unora-snow via-unora-blush/20 to-unora-cloud/45"
        footer={
          <div className="flex w-full min-w-0">
            <Button
              type="button"
              variant="primary"
              className="w-full gap-app-2"
              disabled={locationSubmitting}
              onClick={handleEnableLocation}>
              <LocateFixed className="h-4 w-4" aria-hidden />
              {locationSubmitting
                ? locationPrompt.loadingCta
                : locationPrompt.cta}
            </Button>
          </div>
        }
      />

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
    </>
  );
}
