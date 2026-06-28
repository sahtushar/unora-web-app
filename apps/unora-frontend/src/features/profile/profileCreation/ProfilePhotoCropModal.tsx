import {useCallback, useId, useState} from "react";

import Cropper, {type Area} from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";

import {Button, Modal} from "@/components/ui";
import {getCroppedPhotoDataUrl} from "@/lib/getCroppedPhoto";

import {strings} from "../../strings";

const cropFailed = strings.profile.profileCreation.photos.cropFailed;

type ProfilePhotoCropModalProps = {
  cancelLabel: string;
  cropHint: string;
  imageSrc: string | null;
  open: boolean;
  saveLabel: string;
  title: string;
  zoomLabel: string;
  onClose: () => void;
  onSave: (dataUrl: string) => void | Promise<void>;
};

const CROP_ASPECT = 1;

export function ProfilePhotoCropModal({
  open,
  imageSrc,
  onClose,
  onSave,
  title,
  cropHint,
  zoomLabel,
  saveLabel,
  cancelLabel,
}: ProfilePhotoCropModalProps) {
  const zoomId = useId();
  const [crop, setCrop] = useState({x: 0, y: 0});
  const [zoom, setZoom] = useState(1);
  const [pixels, setPixels] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setPixels(areaPixels);
  }, []);

  const handleSave = useCallback(async () => {
    if (!imageSrc || !pixels) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const dataUrl = await getCroppedPhotoDataUrl(imageSrc, pixels);
      await onSave(dataUrl);
      onClose();
    } catch {
      setError(cropFailed);
    } finally {
      setBusy(false);
    }
  }, [imageSrc, pixels, onSave, onClose]);

  const footer = (
    <div className="flex flex-col-reverse gap-app-2 sm:flex-row sm:justify-end">
      <Button
        type="button"
        variant="outlineInk"
        className="min-h-[3rem] w-full sm:w-auto"
        onClick={onClose}
        disabled={busy}>
        {cancelLabel}
      </Button>
      <Button
        type="button"
        variant="primary"
        className="min-h-[3rem] w-full sm:w-auto"
        onClick={() => void handleSave()}
        disabled={busy || !pixels}>
        {saveLabel}
      </Button>
    </div>
  );

  return (
    <Modal
      open={open && Boolean(imageSrc)}
      onClose={onClose}
      title={title}
      description={cropHint}
      footer={footer}
      animation="fade"
      className="max-h-[min(92dvh,52rem)] max-w-[min(100vw-1rem,26rem)] sm:max-w-xl"
      backdropDismissAriaLabel={cancelLabel}>
      {imageSrc ? (
        <div className="space-y-app-3">
          <div
            className="relative w-full overflow-hidden rounded-2xl bg-unora-ink ring-1 ring-unora-line/60"
            style={{touchAction: "none", height: "min(48vh, 22rem)"}}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={CROP_ASPECT}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              showGrid={false}
              restrictPosition
              minZoom={1}
              maxZoom={4}
              zoomSpeed={0.4}
              cropShape="rect"
            />
          </div>
          <div className="space-y-app-1">
            <label
              htmlFor={zoomId}
              className="text-xs font-semibold uppercase tracking-wide text-unora-mist">
              {zoomLabel}
            </label>
            <input
              id={zoomId}
              type="range"
              min={1}
              max={4}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="tap-highlight-none h-11 w-full cursor-pointer accent-unora-brand-strong"
            />
          </div>
          {error ? (
            <p
              className="text-center text-sm font-medium text-unora-rose"
              role="alert">
              {error}
            </p>
          ) : null}
        </div>
      ) : null}
    </Modal>
  );
}
