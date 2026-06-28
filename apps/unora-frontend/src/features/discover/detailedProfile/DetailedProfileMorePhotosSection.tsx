import {Images} from "lucide-react";

import {cn} from "@/lib/cn";
import type {Photo} from "@/types";

import {strings} from "../../strings";
import {
  DetailedProfileSection,
  DetailedProfileSectionHeading,
} from "./DetailedProfileShared";
import {DETAILED_PROFILE_SECTION_IDS} from "./detailedProfileAnchors";

const s = strings.discover.detailedProfile;

export function DetailedProfileMorePhotosSection({
  photos,
  heroIndex,
  onSelectPhotoIndex,
}: {
  heroIndex: number;
  photos: Photo[];
  onSelectPhotoIndex: (index: number) => void;
}) {
  if (photos.length <= 1) {
    return null;
  }

  return (
    <DetailedProfileSection id={DETAILED_PROFILE_SECTION_IDS.morePhotos}>
      <DetailedProfileSectionHeading icon={Images}>
        {s.photosTitle}
      </DetailedProfileSectionHeading>
      <div className="mt-app-3 flex gap-app-2 overflow-x-auto pb-app-1 scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {photos.map((ph, i) => (
          <button
            key={ph.id}
            type="button"
            onClick={() => onSelectPhotoIndex(i)}
            className={cn(
              "tap-highlight-none relative h-24 w-20 shrink-0 overflow-hidden rounded-xl ring-2 transition-transform active:scale-[0.98]",
              i === heroIndex
                ? "ring-unora-brand-strong"
                : "ring-transparent hover:ring-unora-line"
            )}>
            <img src={ph.url} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </DetailedProfileSection>
  );
}
