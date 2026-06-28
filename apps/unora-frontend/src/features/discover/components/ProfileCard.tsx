import {
  type KeyboardEvent,
  type MouseEvent,
  memo,
  useCallback,
  useMemo,
  useState,
} from "react";

import {Heart, X} from "lucide-react";
import {useNavigate} from "react-router-dom";

import {Card, LazyImage, MetadataChip} from "@/components/ui";
import {cn} from "@/lib/cn";
import {discoverProfilePath} from "@/lib/routes";
import type {DatingIntentionPresetId, DiscoverProfile} from "@/types";

import {strings} from "../../strings";
import {interestIdsToInterestChips} from "../discoverInterestLabels";
import {buildProfileCardMetadataRows} from "./profileCardMetadataRows";

const d = strings.discover.profileCard;
const dp = strings.discover.detailedProfile;

const discoverDegreeLabels = strings.profile.profileCreation.selectOptions
  .degree as Record<string, string>;

const intentionPresetLabels = strings.profile.profileCreation.preferences
  .intentionPresets as Record<DatingIntentionPresetId, string>;

export interface ProfileCardProps {
  profile: DiscoverProfile;
  /** When true, hides Pass/Like (e.g. active connection preview on Discover). */
  hideDiscoverActions?: boolean;
  /**
   * Profile editor / static preview: no open-detailed navigation and no pointer
   * affordance on the full card.
   */
  previewMode?: boolean;
  /** Return `false` to cancel the like (e.g. gated by product rules). */
  onLike: (id: string) => boolean | void;
  onPass: (id: string) => void;
}

export const ProfileCard = memo(function ProfileCard({
  profile,
  hideDiscoverActions = false,
  previewMode = false,
  onLike,
  onPass,
}: ProfileCardProps) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const primaryPhoto = profile.photos[0];
  const hasPrimaryPhoto = primaryPhoto !== undefined;

  const interestOverlayChips = useMemo(
    () => interestIdsToInterestChips(profile.interestIds).slice(0, 6),
    [profile.interestIds]
  );

  const metadataRows = useMemo(
    () =>
      buildProfileCardMetadataRows(
        profile,
        discoverDegreeLabels,
        intentionPresetLabels
      ),
    [profile]
  );

  const handleLike = useCallback(() => {
    const ok = onLike(profile.id);
    if (ok === false) {
      return;
    }
    setLiked(true);
  }, [onLike, profile.id]);

  const openDetailed = useCallback(() => {
    if (previewMode) {
      return;
    }
    navigate(discoverProfilePath(profile.id));
  }, [navigate, previewMode, profile.id]);

  const handleCardClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (previewMode) {
        return;
      }
      const t = e.target as HTMLElement;
      if (t.closest("[data-profile-card-interactive]")) {
        return;
      }
      openDetailed();
    },
    [openDetailed, previewMode]
  );

  const handleCardKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (previewMode) {
        return;
      }
      if (e.key !== "Enter" && e.key !== " ") {
        return;
      }
      const t = e.target as HTMLElement;
      if (t.closest("[data-profile-card-interactive]")) {
        return;
      }
      e.preventDefault();
      openDetailed();
    },
    [openDetailed, previewMode]
  );

  return (
    <Card
      padded={false}
      role="region"
      tabIndex={previewMode ? -1 : 0}
      aria-label={
        previewMode
          ? d.previewModeAria
          : dp.openFullProfileAria(profile.displayName)
      }
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      className={cn(
        "overflow-hidden rounded-3xl border-unora-line/70 bg-white shadow-card",
        previewMode
          ? "cursor-default"
          : "cursor-pointer transition-shadow duration-300 hover:shadow-lift"
      )}>
      <div className="relative aspect-[4/5] w-full bg-unora-cloud">
        {hasPrimaryPhoto ? (
          <LazyImage
            src={primaryPhoto.url}
            blurDataUrl={primaryPhoto.blurDataUrl}
            alt={primaryPhoto.alt}
            className="h-full w-full"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-unora-mist">
            {d.noPhoto}
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

        {hasPrimaryPhoto && !hideDiscoverActions ? (
          <>
            <button
              type="button"
              data-profile-card-interactive
              onClick={(e) => {
                e.stopPropagation();
                onPass(profile.id);
              }}
              aria-label={d.pass}
              className="tap-highlight-none absolute bottom-app-4 left-app-4 z-20 flex h-14 w-14 items-center justify-center rounded-full border border-unora-line/90 bg-unora-snow/95 text-unora-ink shadow-lift backdrop-blur-sm transition-all duration-200 hover:border-unora-ink/12 hover:bg-white active:scale-[0.96]">
              <X className="h-6 w-6 shrink-0" strokeWidth={2.25} aria-hidden />
            </button>

            <button
              type="button"
              data-profile-card-interactive
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
              disabled={liked}
              aria-label={d.likeAriaLabel}
              className={cn(
                "tap-highlight-none absolute bottom-app-4 right-app-4 z-20 flex h-14 w-14 items-center justify-center rounded-full text-unora-snow shadow-lift transition-all duration-200 active:scale-[0.96]",
                liked
                  ? "bg-unora-brand-strong ring-2 ring-unora-brand/35"
                  : "bg-unora-brand hover:brightness-[0.97] disabled:opacity-60"
              )}>
              <Heart
                className="h-7 w-7 shrink-0 text-unora-snow"
                fill={liked ? "currentColor" : "none"}
                strokeWidth={1.6}
                aria-hidden
              />
            </button>
          </>
        ) : null}

        {hasPrimaryPhoto && interestOverlayChips.length > 0 ? (
          <div
            className={cn(
              "pointer-events-none absolute left-app-3 right-app-3 flex flex-wrap gap-app-2",
              hideDiscoverActions ? "bottom-app-4" : "bottom-[5.75rem]"
            )}>
            {interestOverlayChips.map(({id, label, icon}) => (
              <MetadataChip
                key={id}
                variant="overlay"
                icon={icon}
                label={label}
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="border-t border-unora-line/80 bg-white px-app-4 py-app-3 sm:px-app-5 sm:py-app-4">
        <div className="min-w-0">
          <p className="truncate font-sans text-lg font-semibold tracking-tight text-unora-ink sm:text-xl">
            {profile.displayName}, {profile.age}
          </p>
          <p className="truncate text-xs font-medium text-unora-mist">
            {profile.headline}
          </p>
        </div>
        {metadataRows.length > 0 ? (
          <div className="mt-app-3 space-y-app-2">
            {metadataRows.map((row) => (
              <div
                key={row.map((c) => c.key).join("-")}
                className="flex flex-wrap gap-app-2">
                {row.map(({icon, key, label}) => (
                  <MetadataChip key={key} icon={icon} label={label} />
                ))}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </Card>
  );
});
