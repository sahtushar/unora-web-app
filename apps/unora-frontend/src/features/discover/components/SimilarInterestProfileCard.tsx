import {memo} from "react";

import {LazyImage} from "@/components/ui";
import {cn} from "@/lib/cn";
import type {DiscoverProfile} from "@/types";

import {strings} from "../../strings";

const placeholder = strings.discover.similarStrip.photoPlaceholder;

export interface SimilarInterestProfileCardProps {
  profile: DiscoverProfile;
  onSelect: (profile: DiscoverProfile) => void;
}

export const SimilarInterestProfileCard = memo(
  function SimilarInterestProfileCard({
    profile,
    onSelect,
  }: SimilarInterestProfileCardProps) {
    const photo = profile.photos[0];
    const aria = strings.discover.similarStrip.selectProfileAria(
      profile.displayName,
      profile.age
    );

    return (
      <button
        type="button"
        onClick={() => onSelect(profile)}
        aria-label={aria}
        className={cn(
          "tap-highlight-none group flex w-[7.25rem] shrink-0 flex-col overflow-hidden rounded-2xl border border-unora-line/80 bg-white p-0 text-left shadow-soft outline-none",
          "transition-shadow hover:shadow-card focus-visible:ring-2 focus-visible:ring-unora-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-unora-snow",
          "active:scale-[0.99]"
        )}>
        <div className="relative aspect-[3/4] w-full bg-unora-cloud">
          {photo ? (
            <LazyImage
              src={photo.url}
              blurDataUrl={photo.blurDataUrl}
              alt={photo.alt}
              className="h-full w-full"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[10px] text-unora-mist">
              {placeholder}
            </div>
          )}
        </div>
        <div className="px-app-2 py-app-2">
          <p className="truncate text-center text-xs font-semibold text-unora-ink">
            {profile.displayName}, {profile.age}
          </p>
        </div>
      </button>
    );
  }
);
