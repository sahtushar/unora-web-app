import {type ChangeEvent, useCallback, useRef, useState} from "react";

import {Images, Pencil, Plus, Trash2} from "lucide-react";

import {Button, LazyImage, Section} from "@/components/ui";
import {cn} from "@/lib/cn";
import type {Photo} from "@/types";

import {strings} from "../../strings";
import {PROFILE_CREATION_SECTION_IDS} from "../profileAnchors";
import {profileCreationSectionDividerClass} from "./ProfileCreationFields";
import {ProfilePhotoCropModal} from "./ProfilePhotoCropModal";

const p = strings.profile;
const pc = strings.profile.profileCreation;
const pe = pc.photos;

const MAX_PHOTOS = 8;
const MAX_FILE_BYTES = 20 * 1024 * 1024;

function newPhotoFromDataUrl(dataUrl: string): Photo {
  return {
    id: crypto.randomUUID(),
    url: dataUrl,
    alt: p.photos.title,
  };
}

export function ProfileCreationPhotosSection({
  photos,
  onPhotosChange,
}: {
  photos: readonly Photo[];
  onPhotosChange: (photos: Photo[]) => void | Promise<void>;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropReplaceIndex, setCropReplaceIndex] = useState<number | null>(null);
  const [stagingBlobUrl, setStagingBlobUrl] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const revokeStaging = useCallback(() => {
    if (stagingBlobUrl != null && stagingBlobUrl.length > 0) {
      URL.revokeObjectURL(stagingBlobUrl);
      setStagingBlobUrl(null);
    }
  }, [stagingBlobUrl]);

  const closeCrop = useCallback(() => {
    revokeStaging();
    setCropSrc(null);
    setCropReplaceIndex(null);
  }, [revokeStaging]);

  const openFilePickerForAdd = useCallback(() => {
    setNotice(null);
    if (photos.length >= MAX_PHOTOS) {
      setNotice(pe.maxPhotosReached);
      return;
    }
    fileInputRef.current?.click();
  }, [photos.length]);

  const onFileInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file) {
        return;
      }
      if (!file.type.startsWith("image/")) {
        setNotice(pe.fileTypeInvalid);
        return;
      }
      if (file.size > MAX_FILE_BYTES) {
        setNotice(pe.fileTooLarge);
        return;
      }
      if (photos.length >= MAX_PHOTOS) {
        setNotice(pe.maxPhotosReached);
        return;
      }

      const blobUrl = URL.createObjectURL(file);
      revokeStaging();
      setStagingBlobUrl(blobUrl);
      setCropSrc(blobUrl);
      setCropReplaceIndex(null);
    },
    [photos.length, revokeStaging]
  );

  const applyCroppedImage = useCallback(
    async (dataUrl: string) => {
      const next = newPhotoFromDataUrl(dataUrl);
      const list =
        cropReplaceIndex === null
          ? [...photos, next]
          : (() => {
              const copy = [...photos];
              copy[cropReplaceIndex] = next;
              return copy;
            })();
      await onPhotosChange(list);
      revokeStaging();
      setCropSrc(null);
      setCropReplaceIndex(null);
    },
    [photos, cropReplaceIndex, onPhotosChange, revokeStaging]
  );

  const removeAt = useCallback(
    async (index: number) => {
      await onPhotosChange(photos.filter((_, i) => i !== index));
    },
    [photos, onPhotosChange]
  );

  const openCropForExisting = useCallback(
    (index: number) => {
      setNotice(null);
      revokeStaging();
      setStagingBlobUrl(null);
      const url = photos[index]?.url;
      if (url === undefined || url.length === 0) {
        return;
      }
      setCropSrc(url);
      setCropReplaceIndex(index);
    },
    [photos, revokeStaging]
  );

  const canAdd = photos.length < MAX_PHOTOS;

  return (
    <Section
      collapsible
      id={PROFILE_CREATION_SECTION_IDS.photos}
      className={profileCreationSectionDividerClass}
      titleIcon={Images}
      title={p.photos.title}
      description={p.photos.description}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-hidden
        tabIndex={-1}
        onChange={onFileInputChange}
      />

      <div className="grid grid-cols-2 gap-app-2 sm:grid-cols-3">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="group relative aspect-square overflow-hidden rounded-2xl ring-1 ring-unora-line/80 transition-shadow duration-300 hover:shadow-soft">
            <LazyImage
              src={photo.url}
              blurDataUrl={photo.blurDataUrl}
              alt={photo.alt}
              className="aspect-square h-full w-full"
            />
            <div className="absolute inset-x-0 bottom-0 flex justify-end gap-app-1 bg-gradient-to-t from-black/55 via-black/25 to-transparent p-app-2 pt-app-8 opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:opacity-100">
              <Button
                type="button"
                variant="outlineInk"
                size="icon"
                className="tap-highlight-none shrink-0 border-white/30 bg-black/35 text-white shadow-none backdrop-blur-sm hover:bg-black/50"
                aria-label={pe.replacePhotoAria}
                onClick={() => openCropForExisting(index)}>
                <Pencil className="h-4 w-4" strokeWidth={2} aria-hidden />
              </Button>
              <Button
                type="button"
                variant="outlineInk"
                size="icon"
                className="tap-highlight-none shrink-0 border-white/30 bg-black/35 text-white shadow-none backdrop-blur-sm hover:bg-black/50"
                aria-label={pe.removePhotoAria}
                onClick={() => removeAt(index)}>
                <Trash2 className="h-4 w-4" strokeWidth={2} aria-hidden />
              </Button>
            </div>
          </div>
        ))}

        {canAdd ? (
          <button
            type="button"
            onClick={openFilePickerForAdd}
            aria-label={pe.addPhotoAria}
            className={cn(
              "tap-highlight-none flex aspect-square flex-col items-center justify-center gap-app-2 rounded-2xl border-2 border-dashed border-unora-line/90 bg-unora-cloud/40 text-unora-mist transition hover:border-unora-brand-strong/50 hover:bg-unora-cloud/70 hover:text-unora-ink active:scale-[0.99]"
            )}>
            <Plus className="h-8 w-8 stroke-[1.75]" aria-hidden />
            <span className="text-xs font-semibold">{pe.addPhoto}</span>
          </button>
        ) : null}
      </div>

      <p className="mt-app-2 text-center text-xs leading-relaxed text-unora-mist">
        {pe.maxPhotosNote}
      </p>
      <p className="mt-app-1 text-center text-xs leading-relaxed text-unora-mist">
        {pc.photos.richGalleryHint}
      </p>
      {notice !== null && notice.length > 0 ? (
        <p
          className="mt-app-2 text-center text-sm font-medium text-unora-rose"
          role="alert">
          {notice}
        </p>
      ) : null}

      <ProfilePhotoCropModal
        open={Boolean(cropSrc)}
        imageSrc={cropSrc}
        onClose={closeCrop}
        onSave={applyCroppedImage}
        title={pe.cropTitle}
        cropHint={pe.cropHint}
        zoomLabel={pe.zoomLabel}
        saveLabel={pe.saveCrop}
        cancelLabel={pe.cancelCrop}
      />
    </Section>
  );
}
