import {useLayoutEffect} from "react";

import {routes} from "@/lib/routes";

import {PROFILE_CREATION_SECTION_IDS} from "./profileAnchors";

const SCROLL_HASH_IDS = new Set<string>(
  Object.values(PROFILE_CREATION_SECTION_IDS) as string[]
);

/** When `location.hash` matches a profile section id, scroll to it and strip the hash. */
export function useProfileEditHashScroll(pathname: string, hash: string) {
  useLayoutEffect(() => {
    if (pathname !== routes.profileEdit) {
      return;
    }
    const id = hash.startsWith("#") ? hash.slice(1) : hash;
    if (!id || !SCROLL_HASH_IDS.has(id)) {
      return;
    }
    const el = document.getElementById(id);
    requestAnimationFrame(() => {
      el?.scrollIntoView({behavior: "smooth", block: "start"});
    });
    const clearHash = globalThis.setTimeout(() => {
      globalThis.history.replaceState(null, "", routes.profileEdit);
    }, 600);
    return () => globalThis.clearTimeout(clearHash);
  }, [hash, pathname]);
}
