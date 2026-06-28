import {memo, useCallback, useState} from "react";

import {useQuery} from "@tanstack/react-query";
import {Navigate, useNavigate, useParams} from "react-router-dom";

import {Button, ScreenSkeleton} from "@/components/ui";
import {useActiveConnection} from "@/hooks/useActiveConnection";
import type {DiscoverLocationState} from "@/lib/discoverNavigationState";
import {routes} from "@/lib/routes";
import {fetchDiscoverProfileById} from "@/services/profileService";
import {queryKeys} from "@/services/queryKeys";
import type {DiscoverProfile} from "@/types";

import {strings} from "../strings";
import {DetailedProfileLayout} from "./DetailedProfileLayout";
import {IconHeart} from "./components/discoverIcons";

const s = strings.discover.detailedProfile;

export default memo(function DetailedProfilePage() {
  const {profileId: rawId} = useParams<{profileId: string}>();
  const profileId =
    typeof rawId === "string" && rawId.length > 0
      ? decodeURIComponent(rawId)
      : "";
  const navigate = useNavigate();
  const connection = useActiveConnection();
  const hasActive = Boolean(connection.data);

  const [likeBlocked, setLikeBlocked] = useState(false);

  const profileQuery = useQuery({
    queryKey: queryKeys.discoverProfile(profileId),
    queryFn: () => fetchDiscoverProfileById(profileId),
    enabled: Boolean(profileId),
  });

  const profile = profileQuery.data ?? null;

  const close = useCallback(() => {
    if (globalThis.history.length > 1) {
      navigate(-1);
    } else {
      navigate(routes.discover);
    }
  }, [navigate]);

  const sendDiscoverIntent = useCallback(
    (intent: "pass" | "like", id: string) => {
      const state: DiscoverLocationState = {
        discoverIntent: {intent, profileId: id},
      };
      navigate(routes.discover, {state});
    },
    [navigate]
  );

  const handlePass = useCallback(() => {
    if (!profile) {
      return;
    }
    sendDiscoverIntent("pass", profile.id);
  }, [profile, sendDiscoverIntent]);

  const handleLike = useCallback(
    (p: DiscoverProfile) => {
      if (hasActive) {
        setLikeBlocked(true);
        return;
      }
      sendDiscoverIntent("like", p.id);
    },
    [hasActive, sendDiscoverIntent]
  );

  if (!profileId) {
    return <Navigate to={routes.discover} replace />;
  }

  if (profileQuery.isLoading) {
    return <ScreenSkeleton variant="discover" />;
  }

  if (!profile) {
    return <Navigate to={routes.discover} replace />;
  }

  return (
    <DetailedProfileLayout
      insideBodySlot={
        likeBlocked ? (
          <div className="mt-app-4 rounded-2xl border border-unora-line/80 bg-unora-cloud/80 px-app-3 py-app-3 text-center text-xs leading-relaxed text-unora-mist">
            <p className="font-semibold text-unora-ink">
              {strings.discover.likeBlockedTitle}
            </p>
            <p className="mt-app-1">{strings.discover.likeBlockedBody}</p>
            <button
              type="button"
              onClick={() => setLikeBlocked(false)}
              className="tap-highlight-none mt-app-2 text-xs font-semibold text-unora-brand-strong underline-offset-2 hover:underline">
              {strings.discover.likeBlockedDismiss}
            </button>
          </div>
        ) : null
      }
      footer={
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-app-4 pb-[max(calc(env(safe-area-inset-bottom)+5.25rem),5.25rem)] pt-app-2">
          <div className="pointer-events-auto flex w-full max-w-app gap-app-2">
            <Button
              type="button"
              variant="outlineInk"
              size="lg"
              className="min-h-[3.25rem] flex-1 rounded-2xl font-semibold"
              onClick={handlePass}>
              {s.passCta}
            </Button>
            <Button
              type="button"
              variant="primary"
              size="lg"
              className="min-h-[3.25rem] flex-1 rounded-2xl font-semibold"
              onClick={() => {
                handleLike(profile);
              }}>
              <span className="inline-flex items-center gap-2">
                <IconHeart filled className="text-unora-snow" />
                {s.likeCta}
              </span>
            </Button>
          </div>
        </div>
      }
      onClose={close}
      profile={profile}
    />
  );
});

export {DetailedProfileLayout} from "./DetailedProfileLayout";
