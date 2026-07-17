import {useCallback, useEffect, useState} from "react";

import {useQueryClient} from "@tanstack/react-query";
import {ArrowRight, LogOut} from "lucide-react";
import {useLocation, useNavigate} from "react-router-dom";

import {Button, ScreenSkeleton, useToast} from "@/components/ui";
import {useAuth} from "@/features/auth/useAuth";
import {useCurrentUser} from "@/hooks/useCurrentUser";
import {cn} from "@/lib/cn";
import {AUTH_LOCATION_SYNCED_EVENT} from "@/lib/locationSyncEvents";
import {routes} from "@/lib/routes";
import {patchUserProfileDetails} from "@/services/profileDetailsApi";
import {queryKeys} from "@/services/queryKeys";
import type {CurrentUserProfile, UserLocationDetails} from "@/types";

import {strings} from "../strings";
import {AboutSlide} from "./profileCompletion/AboutSlide";
import {InterestsSlide} from "./profileCompletion/InterestsSlide";
import {LocationSlide} from "./profileCompletion/LocationSlide";
import {PreferencesSlide} from "./profileCompletion/PreferencesSlide";
import {WelcomeBasicsSlide} from "./profileCompletion/WelcomeBasicsSlide";
import {
  ABOUT_MIN_LENGTH,
  type CompletionDraft,
  type SlideId,
} from "./profileCompletion/types";
import {
  PROFILE_CREATION_MIN_INTERESTS,
  type ProfilePreferencesDraft,
  profilePreferencesDraftToUserSlice,
} from "./profileCreationModel";

const SLIDE_ORDER: SlideId[] = [
  "welcome",
  "preferences",
  "interests",
  "about",
  "location",
];
const pcf = strings.profile.profileCompletionFlow;
const accountCopy = strings.profile.account;

function toIsoDateInput(value: string | undefined): string {
  if (value === undefined) {
    return "";
  }
  const raw = value.trim();
  if (raw.length === 0) {
    return "";
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return raw;
  }
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) {
    return "";
  }
  return d.toISOString().slice(0, 10);
}

function currentSlideValid(slideId: SlideId, draft: CompletionDraft): boolean {
  if (slideId === "welcome") {
    return (
      draft.firstName.trim().length >= 2 &&
      draft.dateOfBirth.trim().length > 0 &&
      draft.gender.trim().length > 0
    );
  }
  if (slideId === "preferences") {
    return (
      draft.preferences.intentions.trim().length > 0 &&
      draft.preferences.seeking.length > 0
    );
  }
  if (slideId === "interests") {
    return draft.interests.length >= PROFILE_CREATION_MIN_INTERESTS;
  }
  if (slideId === "about") {
    return draft.bio.trim().length >= ABOUT_MIN_LENGTH;
  }
  return (
    draft.location.trim().length > 0 &&
    draft.gps !== null &&
    Number.isFinite(draft.latitude) &&
    Number.isFinite(draft.longitude) &&
    draft.country.trim().length > 0
  );
}

function slideTitle(slideId: SlideId): string {
  if (slideId === "welcome") {
    return pcf.slides.welcome.title;
  }
  if (slideId === "preferences") {
    return pcf.slides.preferences.title;
  }
  if (slideId === "interests") {
    return pcf.slides.interests.title;
  }
  if (slideId === "about") {
    return pcf.slides.about.title;
  }
  return pcf.slides.location.title;
}

function slideDescription(slideId: SlideId): string {
  if (slideId === "welcome") {
    return pcf.slides.welcome.description;
  }
  if (slideId === "preferences") {
    return pcf.slides.preferences.description;
  }
  if (slideId === "interests") {
    return pcf.slides.interests.description;
  }
  if (slideId === "about") {
    return pcf.slides.about.description;
  }
  return pcf.slides.location.description;
}

function nextLabel(slideId: SlideId, isLast: boolean): string {
  if (isLast) {
    return pcf.next.finish;
  }
  if (slideId === "welcome") {
    return pcf.next.toPreferences;
  }
  if (slideId === "preferences") {
    return pcf.next.toInterests;
  }
  if (slideId === "interests") {
    return pcf.next.toAbout;
  }
  if (slideId === "about") {
    return pcf.next.toLocation;
  }
  return pcf.next.finish;
}

function splitDisplayName(name: string): {firstName: string; lastName: string} {
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    return {firstName: "", lastName: ""};
  }
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    return {firstName: parts[0] ?? "", lastName: ""};
  }
  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" "),
  };
}

export default function ProfileCompletionFlowPage() {
  const me = useCurrentUser();

  if (me.isLoading || !me.data) {
    return <ScreenSkeleton variant="profile" />;
  }

  return <ProfileCompletionFlowBody user={me.data} />;
}

function ProfileCompletionFlowBody({user}: {user: CurrentUserProfile}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const {showToast} = useToast();
  const {signOut} = useAuth();
  const [slideIndex, setSlideIndex] = useState(0);
  const locationBusy = false;
  const [submitting, setSubmitting] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const parsedName = splitDisplayName(user.displayName);
  const [draft, setDraft] = useState<CompletionDraft>(() => {
    const ul = user.userLocation;
    const hasCoords =
      ul != null &&
      Number.isFinite(ul.latitude) &&
      Number.isFinite(ul.longitude);
    const label = ul?.label;
    const fromLabel =
      label !== undefined && label.trim().length > 0 ? label : "";
    const fromLegacy =
      user.location !== undefined && user.location.trim().length > 0
        ? user.location.trim()
        : "";
    return {
      area: ul?.area ?? "",
      bio: user.bio,
      city: ul?.city ?? "",
      country: ul?.country ?? "",
      firstName: parsedName.firstName,
      lastName: parsedName.lastName,
      dateOfBirth: toIsoDateInput(user.dateOfBirth),
      gender: user.gender,
      interests: [...user.interests],
      location: fromLabel.length > 0 ? fromLabel : fromLegacy,
      preferences: {
        seeking: [...user.preferences.seeking],
        ageMin: user.preferences.ageRange.min,
        ageMax: user.preferences.ageRange.max,
        ageRangeStrict: user.preferences.ageRangeStrict ?? false,
        distanceKm: user.preferences.distanceKm,
        intentions: user.preferences.intentions,
      },
      gps: hasCoords ? {lat: ul.latitude, lng: ul.longitude} : null,
      latitude: hasCoords ? ul.latitude : null,
      longitude: hasCoords ? ul.longitude : null,
    };
  });
  const [locationEnabled, setLocationEnabled] = useState(
    () =>
      draft.gps !== null &&
      Number.isFinite(draft.latitude) &&
      Number.isFinite(draft.longitude)
  );

  const slideId: SlideId = SLIDE_ORDER[slideIndex] ?? "welcome";
  const isLastSlide = slideIndex === SLIDE_ORDER.length - 1;
  const slideValid = currentSlideValid(slideId, draft);
  const canContinue = slideValid && (slideId !== "welcome" || locationEnabled);

  const patchDraft = (partial: Partial<CompletionDraft>) => {
    setDraft((prev) => ({...prev, ...partial}));
  };

  const applySyncedLocation = useCallback((detail: UserLocationDetails) => {
    setDraft((prev) => ({
      ...prev,
      area: detail.area,
      city: detail.city,
      country: detail.country,
      gps: {lat: detail.latitude, lng: detail.longitude},
      latitude: detail.latitude,
      location: detail.label,
      longitude: detail.longitude,
    }));
    setLocationEnabled(true);
  }, []);

  useEffect(() => {
    const onLocationSynced = (event: Event) => {
      const detail = (event as CustomEvent<CurrentUserProfile["userLocation"]>)
        .detail;
      if (detail === null || detail === undefined) {
        return;
      }

      applySyncedLocation(detail);
    };

    globalThis.addEventListener(AUTH_LOCATION_SYNCED_EVENT, onLocationSynced);
    return () =>
      globalThis.removeEventListener(
        AUTH_LOCATION_SYNCED_EVENT,
        onLocationSynced
      );
  }, [applySyncedLocation]);

  const patchPreferences = (partial: Partial<ProfilePreferencesDraft>) => {
    setDraft((prev) => ({
      ...prev,
      preferences: {...prev.preferences, ...partial},
    }));
  };

  const toggleSeeking = (value: string) => {
    setDraft((prev) => {
      const has = prev.preferences.seeking.includes(value);
      const next = has
        ? prev.preferences.seeking.filter((item) => item !== value)
        : [...prev.preferences.seeking, value];
      return {
        ...prev,
        preferences: {...prev.preferences, seeking: next},
      };
    });
  };

  const toggleInterest = (interestId: string) => {
    setDraft((prev) => {
      const has = prev.interests.includes(interestId);
      if (has === true) {
        return {
          ...prev,
          interests: prev.interests.filter((id) => id !== interestId),
        };
      }
      return {
        ...prev,
        interests: [...prev.interests, interestId],
      };
    });
  };

  const onSignOut = async () => {
    if (signingOut) {
      return;
    }
    setSigningOut(true);
    try {
      await signOut();
      globalThis.location.replace(routes.discover);
    } finally {
      setSigningOut(false);
    }
  };

  const onNext = async () => {
    if (!canContinue || submitting || signingOut) {
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      if (slideId === "welcome") {
        const fullName =
          `${draft.firstName.trim()} ${draft.lastName.trim()}`.trim();
        const response = await patchUserProfileDetails({
          displayName: fullName,
          dateOfBirth: draft.dateOfBirth,
          gender: draft.gender,
        });
        queryClient.setQueryData<CurrentUserProfile>(
          queryKeys.currentUser,
          (prev) => ({
            ...(prev ?? user),
            displayName: response.displayName ?? fullName,
            dateOfBirth: response.dateOfBirth ?? draft.dateOfBirth,
            gender: response.gender ?? draft.gender,
          })
        );
      } else if (slideId === "preferences") {
        const prefPayload = profilePreferencesDraftToUserSlice(
          draft.preferences
        );
        const response = await patchUserProfileDetails({
          preferences: prefPayload,
        });
        queryClient.setQueryData<CurrentUserProfile>(
          queryKeys.currentUser,
          (prev) => {
            const base = prev ?? user;
            if (!response.preferences) {
              return {...base, preferences: prefPayload};
            }
            return {
              ...base,
              preferences: {
                seeking: [...response.preferences.seeking],
                ageRange: {...response.preferences.ageRange},
                ageRangeStrict: response.preferences.ageRangeStrict === true,
                distanceKm: response.preferences.distanceKm,
                intentions: response.preferences.intentions,
              },
            };
          }
        );
      } else if (slideId === "interests") {
        const nextInterests = [...draft.interests];
        const response = await patchUserProfileDetails({
          interests: nextInterests,
        });
        queryClient.setQueryData<CurrentUserProfile>(
          queryKeys.currentUser,
          (prev) => ({
            ...(prev ?? user),
            interests: [...(response.interests ?? nextInterests)],
          })
        );
      } else if (slideId === "about") {
        const bio = draft.bio.trim();
        const response = await patchUserProfileDetails({bio});
        queryClient.setQueryData<CurrentUserProfile>(
          queryKeys.currentUser,
          (prev) => ({
            ...(prev ?? user),
            bio: response.bio ?? bio,
          })
        );
      } else {
        if (
          draft.latitude === null ||
          draft.longitude === null ||
          !Number.isFinite(draft.latitude) ||
          !Number.isFinite(draft.longitude)
        ) {
          setError(pcf.saveError);
          return;
        }
        const userLocation = {
          label: draft.location.trim(),
          latitude: draft.latitude,
          longitude: draft.longitude,
          area: draft.area.trim(),
          city: draft.city.trim(),
          country: draft.country.trim(),
        };
        const response = await patchUserProfileDetails({
          location: userLocation.label,
          userLocation,
        });
        queryClient.setQueryData<CurrentUserProfile>(
          queryKeys.currentUser,
          (prev) => {
            const base = prev ?? user;
            return {
              ...base,
              location: response.location ?? userLocation.label,
              userLocation: response.userLocation ?? userLocation,
            };
          }
        );
      }

      if (isLastSlide) {
        showToast({
          tone: "success",
          title: "Great start. Now complete the rest of your profile.",
          description:
            "Add all remaining details in Complete Profile to unlock stronger, more relevant matches.",
          durationMs: 4800,
        });
        const from = (location.state as {from?: string} | null)?.from;
        const to =
          typeof from === "string" &&
          from.startsWith("/") &&
          from !== routes.completeProfile
            ? from
            : routes.discover;
        navigate(to, {replace: true});
      } else {
        setSlideIndex((prev) => Math.min(prev + 1, SLIDE_ORDER.length - 1));
      }
    } catch {
      setError(pcf.saveError);
    } finally {
      setSubmitting(false);
    }
  };

  let slideNode = (
    <WelcomeBasicsSlide
      draft={draft}
      onPatch={patchDraft}
      locationEnabled={locationEnabled}
      onLocationSynced={applySyncedLocation}
    />
  );
  if (slideId === "preferences") {
    slideNode = (
      <PreferencesSlide
        draft={draft}
        onPatchPreferences={patchPreferences}
        onToggleSeeking={toggleSeeking}
      />
    );
  }
  if (slideId === "location") {
    slideNode = (
      <LocationSlide
        draft={draft}
        onPatch={patchDraft}
        locationBusy={locationBusy}
      />
    );
  }
  if (slideId === "interests") {
    slideNode = (
      <InterestsSlide draft={draft} onToggleInterest={toggleInterest} />
    );
  }
  if (slideId === "about") {
    slideNode = <AboutSlide draft={draft} onPatch={patchDraft} />;
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-xl flex-col px-app-4 pb-app-5 pt-app-4">
      <div className="mb-app-5 flex items-center gap-2">
        {SLIDE_ORDER.map((id) => {
          const active = id === slideId;
          const done = SLIDE_ORDER.indexOf(id) < slideIndex;
          return (
            <span
              key={id}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                active || done ? "bg-unora-brand-strong" : "bg-unora-line/70"
              )}
            />
          );
        })}
      </div>

      <header className="space-y-app-2">
        <h1 className="font-display text-[2rem] leading-tight tracking-tight text-unora-ink">
          {slideTitle(slideId)}
        </h1>
        <p className="text-sm text-unora-mist">{slideDescription(slideId)}</p>
      </header>

      <section className="mt-app-6 flex-1">{slideNode}</section>

      {error === null ? null : (
        <p className="mb-app-3 rounded-xl border border-red-200 bg-red-50 px-app-3 py-app-2 text-sm text-red-800">
          {error}
        </p>
      )}

      <Button
        type="button"
        onClick={() => {
          void onNext();
        }}
        disabled={canContinue === false || submitting || locationBusy}
        className={cn(
          "mt-app-4 h-12 w-full justify-center gap-app-2 rounded-full",
          "bg-unora-brand-strong text-white hover:bg-unora-brand-strong/90"
        )}>
        {submitting ? pcf.saving : nextLabel(slideId, isLastSlide)}
        <ArrowRight className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => {
          void onSignOut();
        }}
        disabled={signingOut || submitting}
        className="mt-6 mx-auto h-9 w-[100px] justify-center rounded-full border border-unora-line/70 bg-white/80 px-app-3 text-xs font-semibold tracking-wide text-unora-mist hover:border-unora-brand/30 hover:bg-unora-cloud/45 hover:text-unora-ink">
        <LogOut className="mr-1 h-3.5 w-3.5" />
        {accountCopy.signOut}
      </Button>
    </div>
  );
}
