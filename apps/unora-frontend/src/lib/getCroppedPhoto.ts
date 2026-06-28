import type {Area} from "react-easy-crop";

const JPEG_QUALITY = 0.9;
/** Longest edge of the saved crop (keeps uploads reasonable on mobile). */
const MAX_OUTPUT_EDGE = 1600;

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new globalThis.Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", () =>
      reject(new Error("Image failed to load"))
    );
    if (!url.startsWith("blob:") && !url.startsWith("data:")) {
      img.crossOrigin = "anonymous";
    }
    img.src = url;
  });
}

/**
 * Renders `pixelCrop` from `imageSrc` (natural pixels, as from react-easy-crop’s
 * `croppedAreaPixels`) into a JPEG data URL, downscaling so the longest edge is at most
 * {@link MAX_OUTPUT_EDGE}.
 */
export async function getCroppedPhotoDataUrl(
  imageSrc: string,
  pixelCrop: Area
): Promise<string> {
  const image = await loadImage(imageSrc);
  const {x, y, width: cw, height: ch} = pixelCrop;

  const maxDim = Math.max(cw, ch);
  const scale = maxDim > MAX_OUTPUT_EDGE ? MAX_OUTPUT_EDGE / maxDim : 1;
  const outW = Math.max(1, Math.round(cw * scale));
  const outH = Math.max(1, Math.round(ch * scale));

  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 2D context unavailable");
  }

  ctx.drawImage(image, x, y, cw, ch, 0, 0, outW, outH);
  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}
