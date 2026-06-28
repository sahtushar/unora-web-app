const SCRIPT_SRC = "https://accounts.google.com/gsi/client";
const SCRIPT_ATTR = "data-unora-google-gsi";

export function loadGoogleIdentityScript(): Promise<void> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return Promise.reject(new Error("Google Sign-In requires a browser."));
  }
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }
  const existing = document.querySelector<HTMLScriptElement>(
    `script[${SCRIPT_ATTR}]`
  );
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), {once: true});
      existing.addEventListener(
        "error",
        () => reject(new Error("Could not load Google Sign-In.")),
        {once: true}
      );
    });
  }
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.setAttribute(SCRIPT_ATTR, "1");
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Could not load Google Sign-In."));
    document.head.append(s);
  });
}
