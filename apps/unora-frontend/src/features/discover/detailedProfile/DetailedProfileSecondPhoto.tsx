import {LazyImage} from "@/components/ui";
import type {Photo} from "@/types";

/**
 * Full-bleed (within the profile sheet) portrait inset for a gallery slot.
 * Pass `photos[1]`–`photos[3]` for mid-sheet insets, or `photos[4]` when the
 * gallery has five or more images; renders nothing when the slot is missing or
 * has no `url`.
 */
export function DetailedProfileSecondPhoto({
  photo,
}: {
  photo: Photo | undefined;
}) {
  if (!photo?.url) {
    return null;
  }

  return (
    <figure className="mt-app-6 -mx-app-4 sm:-mx-app-5 p-2">
      <div className="overflow-hidden rounded-2xl shadow-card ring-1 ring-unora-line/45 ring-inset sm:rounded-[1.35rem]">
        <LazyImage
          src={photo.url}
          blurDataUrl={photo.blurDataUrl}
          alt={photo.alt}
          className="aspect-[4/5] w-full bg-unora-cloud"
        />
      </div>
    </figure>
  );
}
