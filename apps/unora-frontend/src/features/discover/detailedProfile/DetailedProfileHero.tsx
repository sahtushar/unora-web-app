import {BadgeCheck, Briefcase, X} from "lucide-react";

import {LazyImage, StyledCapsule} from "@/components/ui";
import {cn} from "@/lib/cn";
import type {Photo} from "@/types";

const heroNameShadow =
  "[text-shadow:0_1px_2px_rgb(0_0_0_/_0.88),0_2px_20px_rgb(0_0_0_/_0.55)]";

const heroHeadlineShadow =
  "[text-shadow:0_1px_2px_rgb(0_0_0_/_0.82),0_1px_14px_rgb(0_0_0_/_0.48)]";

export function DetailedProfileHero({
  heroPhoto,
  noPhotoLabel,
  displayName,
  age,
  headline,
  showPhotoVerified,
  photoVerifiedLabel,
  closeAria,
  onClose,
  showCloseButton = true,
}: {
  age: number;
  closeAria: string;
  displayName: string;
  headline: string;
  heroPhoto: Photo | undefined;
  noPhotoLabel: string;
  photoVerifiedLabel: string;
  showPhotoVerified: boolean;
  /** When `false` (e.g. profile editor preview), the sheet-style close control is hidden. */
  showCloseButton?: boolean;
  onClose: () => void;
}) {
  return (
    <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden rounded-3xl bg-unora-cloud sm:rounded-[1.35rem]">
      {heroPhoto ? (
        <LazyImage
          src={heroPhoto.url}
          blurDataUrl={heroPhoto.blurDataUrl}
          alt={heroPhoto.alt}
          className="h-full w-full"
        />
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-unora-mist">
          {noPhotoLabel}
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/25" />

      {showCloseButton ? (
        <button
          type="button"
          onClick={onClose}
          aria-label={closeAria}
          className="tap-highlight-none absolute right-app-3 top-app-3 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-black/45 text-white shadow-soft ring-1 ring-white/25 backdrop-blur-md transition-transform hover:bg-black/55 active:scale-[0.96]">
          <X className="h-5 w-5" strokeWidth={2} aria-hidden />
        </button>
      ) : null}

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 px-app-4 pb-app-5 pt-app-16">
        <div className="pointer-events-auto flex flex-wrap items-center gap-app-2">
          {showPhotoVerified ? (
            <StyledCapsule combo="heroOnPhoto">
              <BadgeCheck
                className="h-3 w-3 shrink-0 opacity-95"
                strokeWidth={2}
                aria-hidden
              />
              {photoVerifiedLabel}
            </StyledCapsule>
          ) : null}
        </div>
        <p
          className={cn(
            "mt-app-2 font-display text-2xl font-semibold tracking-tight text-white",
            heroNameShadow
          )}>
          {displayName}, {age}
        </p>
        <p
          className={cn(
            "mt-app-1 flex items-center gap-2 text-sm font-medium text-white/95",
            heroHeadlineShadow
          )}>
          <Briefcase
            className="h-4 w-4 shrink-0 text-white/95 [filter:drop-shadow(0_1px_2px_rgb(0_0_0_/_0.75))]"
            strokeWidth={1.75}
            aria-hidden
          />
          <span className="line-clamp-2">{headline}</span>
        </p>
      </div>
    </div>
  );
}
