/** Turn a canvas / crop `data:image/...;base64,...` URL into a `Blob` for multipart upload. */
export async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return res.blob();
}
