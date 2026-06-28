type UnauthorizedListener = (detail: {path: string}) => void;

const HTTP_UNAUTHORIZED_EVENT = "unora:http-unauthorized";

type UnauthorizedEvent = CustomEvent<{path: string}>;

export function emitHttpUnauthorized(path: string): void {
  if (globalThis.document === undefined) {
    return;
  }
  const event: UnauthorizedEvent = new CustomEvent(HTTP_UNAUTHORIZED_EVENT, {
    detail: {path},
  });
  globalThis.dispatchEvent(event);
}

export function onHttpUnauthorized(listener: UnauthorizedListener): () => void {
  if (globalThis.document === undefined) {
    return () => {};
  }

  const handler = (event: Event) => {
    const e = event as UnauthorizedEvent;
    listener({path: e.detail.path});
  };

  globalThis.addEventListener(HTTP_UNAUTHORIZED_EVENT, handler);
  return () => {
    globalThis.removeEventListener(HTTP_UNAUTHORIZED_EVENT, handler);
  };
}
