import {useCallback, useEffect, useRef, useState} from "react";

import {useQueryClient} from "@tanstack/react-query";
import {LocateFixed, MapPin} from "lucide-react";
import {useLocation} from "react-router-dom";

import {Button, Modal} from "@/components/ui";
import {isProfileCompletionRequired} from "@/features/profile/profileCompletionStatus";
import {strings} from "@/features/strings";
import {useCurrentUser} from "@/hooks/useCurrentUser";
import {AUTH_LOCATION_SYNCED_EVENT} from "@/lib/locationSyncEvents";
import {routes} from "@/lib/routes";
import {syncBrowserLocationToProfile} from "@/lib/syncBrowserLocation";
import {queryKeys} from "@/services/queryKeys";
import type {CurrentUserProfile, UserLocationDetails} from "@/types";

const locationPrompt =
  strings.profile.profileCompletionFlow.slides.welcome.locationPrompt;

function isGeolocationError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error;
}

function dispatchLocationSynced(userLocation: UserLocationDetails) {
  globalThis.dispatchEvent(
    new CustomEvent<UserLocationDetails>(AUTH_LOCATION_SYNCED_EVENT, {
      detail: userLocation,
    })
  );
}

export function LocationSyncGate() {
  const me = useCurrentUser();
  const location = useLocation();
  const queryClient = useQueryClient();
  const attemptedRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const syncLocation = useCallback(
    async (mode: "prompt" | "silent") => {
      if (!("geolocation" in globalThis.navigator)) {
        if (mode === "prompt") {
          setError(locationPrompt.unsupported);
          setOpen(true);
        }
        return;
      }

      if (busy) {
        return;
      }

      setBusy(true);
      setError(null);

      try {
        const result = await syncBrowserLocationToProfile().catch((err) => {
          if (mode === "prompt") {
            setError(
              isGeolocationError(err)
                ? locationPrompt.error
                : locationPrompt.saveError
            );
            setOpen(true);
          }
          return null;
        });
        if (result === null) {
          return;
        }

        queryClient.setQueryData<CurrentUserProfile>(
          queryKeys.currentUser,
          (prev) => {
            const base = prev ?? me.data;
            if (base === undefined) {
              return undefined;
            }
            return {
              ...base,
              location: result.location,
              userLocation: result.userLocation,
            };
          }
        );

        dispatchLocationSynced(result.userLocation);
        setOpen(false);
      } catch {
        if (mode === "prompt") {
          setError(locationPrompt.saveError);
          setOpen(true);
        }
      } finally {
        setBusy(false);
      }
    },
    [busy, me.data, queryClient]
  );

  useEffect(() => {
    if (me.data === undefined || attemptedRef.current) {
      return;
    }
    attemptedRef.current = true;

    const firstOnboardingLocationPrompt =
      location.pathname === routes.completeProfile &&
      isProfileCompletionRequired(me.data) &&
      me.data.userLocation == null;

    if (firstOnboardingLocationPrompt) {
      return;
    }

    if (!("geolocation" in globalThis.navigator)) {
      setError(locationPrompt.unsupported);
      setOpen(true);
      return;
    }

    const permissions = globalThis.navigator.permissions;
    if (permissions === undefined) {
      setOpen(true);
      return;
    }

    void permissions
      .query({name: "geolocation" as PermissionName})
      .then((status) => {
        if (status.state === "granted") {
          void syncLocation("silent");
          return;
        }
        setOpen(true);
      })
      .catch(() => {
        setOpen(true);
      });
  }, [location.pathname, me.data, syncLocation]);

  const title = (
    <span className="flex items-start gap-app-2">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-unora-line/85 bg-unora-cloud/70 text-unora-brand-strong shadow-soft">
        <MapPin className="h-5 w-5" strokeWidth={1.85} aria-hidden />
      </span>
      <span className="min-w-0 pt-0.5">{locationPrompt.title}</span>
    </span>
  );

  return (
    <Modal
      open={open}
      onClose={() => {}}
      title={title}
      description={
        <div className="space-y-app-3">
          <p>{locationPrompt.description}</p>
          {error === null ? null : (
            <p className="rounded-xl border border-red-200 bg-red-50 px-app-3 py-app-2 text-sm font-medium text-red-800">
              {error}
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
            disabled={busy}
            onClick={() => {
              void syncLocation("prompt");
            }}>
            <LocateFixed className="h-4 w-4" aria-hidden />
            {busy ? locationPrompt.loadingCta : locationPrompt.cta}
          </Button>
        </div>
      }
    />
  );
}
