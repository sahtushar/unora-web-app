import type {ReactNode} from "react";

import {cn} from "@/lib/cn";
import type {DiscoverProfile, Photo} from "@/types";

import {strings} from "../strings";
import {
  DetailedProfileAboutSection,
  DetailedProfileAlignmentSection,
  DetailedProfileBasicsSection,
  DetailedProfileConversationSection,
  DetailedProfileHero,
  DetailedProfileHighlightSection,
  DetailedProfileInterestsSection,
  DetailedProfileLifestyleSection,
  DetailedProfileLocationSection,
  DetailedProfileSafetySection,
  DetailedProfileSecondPhoto,
} from "./detailedProfile";

const s = strings.discover.detailedProfile;
const pc = strings.discover.profileCard;

export type DetailedProfileLayoutVariant = "default" | "preview";

type Props = {
  profile: DiscoverProfile;
  className?: string;
  /**
   * Fixed or sticky footer, e.g. pass/like actions. Omitted in `preview` from caller.
   */
  footer?: ReactNode;
  /** Hero photo index. Defaults to 0. */
  heroIndex?: number;
  /**
   * Optional content between body and footer (e.g. like-blocked notice in discover).
   * Rendered after `DetailedProfileSafetySection`, inside the white card for `default`.
   */
  insideBodySlot?: ReactNode;
  /**
   * `default`: full-width discover sheet, bottom padding for fixed pass/like bar.
   * `preview`: embedded in profile editor — no close, lighter bottom padding, no full-bleed.
   */
  variant?: DetailedProfileLayoutVariant;
  /** `default` only: hero close. Ignored in `preview` (no close control). */
  onClose?: () => void;
};

/**
 * Full detailed profile (hero + all sections) shared by `DetailedProfilePage` and the
 * profile editor “View” preview.
 */
export function DetailedProfileLayout({
  profile,
  className,
  variant = "default",
  heroIndex = 0,
  onClose,
  insideBodySlot,
  footer,
}: Props) {
  const photos: Photo[] = profile.photos;
  const heroPhoto: Photo | undefined = photos[heroIndex] ?? photos[0];
  const alignmentChips = profile.compatibility.bullets;

  const isPreview = variant === "preview";

  return (
    <div
      className={cn(
        "relative flex min-h-0 flex-1 flex-col",
        isPreview
          ? "max-h-[min(80vh,52rem)] overflow-y-auto overflow-x-hidden rounded-3xl border border-unora-line/60 bg-unora-snow/40"
          : "-mx-app-1 sm:mx-0",
        className
      )}>
      <DetailedProfileHero
        age={profile.age}
        closeAria={s.closeAria}
        displayName={profile.displayName}
        headline={profile.headline}
        heroPhoto={heroPhoto}
        noPhotoLabel={pc.noPhoto}
        onClose={onClose ?? (() => {})}
        photoVerifiedLabel={s.photoVerified}
        showCloseButton={!isPreview}
        showPhotoVerified={profile.verification.photo}
      />

      <div
        className={cn(
          "relative z-[1] -mt-app-4 flex min-h-0 flex-1 flex-col rounded-t-3xl border border-unora-line/70 border-b-0 bg-white px-app-4 pt-app-5 shadow-soft sm:px-app-5",
          isPreview ? "pb-app-6" : "pb-36 sm:pb-40"
        )}>
        <DetailedProfileAboutSection bio={profile.bio} />

        <DetailedProfileInterestsSection interestIds={profile.interestIds} />

        <DetailedProfileBasicsSection
          city={profile.city}
          companyName={profile.companyName}
          degree={profile.degree}
          height={profile.height}
          hometown={profile.hometown}
          jobTitle={profile.jobTitle}
          schoolName={profile.schoolName}
        />

        <DetailedProfileSecondPhoto photo={photos[1]} />

        <DetailedProfileLifestyleSection
          drinking={profile.drinking}
          exercise={profile.exercise}
          haveKids={profile.haveKids}
          kids={profile.kids}
          languages={profile.languages}
          politics={profile.politics}
          pronouns={profile.pronouns}
          religion={profile.religion}
          smoking={profile.smoking}
          zodiac={profile.zodiac}
        />

        <DetailedProfileSecondPhoto photo={photos[2]} />

        <DetailedProfileConversationSection
          promptAnswer={profile.promptAnswer}
        />

        <DetailedProfileSecondPhoto photo={photos[3]} />

        <DetailedProfileAlignmentSection bullets={alignmentChips} />

        <DetailedProfileHighlightSection headline={profile.headline} />

        {photos.length >= 5 ? (
          <DetailedProfileSecondPhoto photo={photos[4]} />
        ) : null}

        <DetailedProfileLocationSection
          city={profile.city}
          hometown={profile.hometown}
        />

        <DetailedProfileSafetySection />

        {insideBodySlot}
      </div>

      {footer}
    </div>
  );
}
