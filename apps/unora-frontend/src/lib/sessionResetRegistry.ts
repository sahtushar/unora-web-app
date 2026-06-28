/** App registers TanStack cache reset here; auth sign-out calls it. */

let reset: (() => void) | null = null;

export function registerSessionReset(fn: () => void): () => void {
  reset = () => {
    fn();
  };
  return () => {
    reset = null;
  };
}

export function runSessionReset(): void {
  try {
    reset?.();
  } catch {
    /* avoid blocking sign-out */
  }
}
