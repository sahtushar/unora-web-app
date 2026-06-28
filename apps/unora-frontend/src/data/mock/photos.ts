import type {Photo} from "@/types";

/**
 * Mock profile photos — Unsplash portraits (women), 800×1000 crop.
 * Replace with your CDN when the API is wired; honor Unsplash license in production.
 */
const womanPhoto = (id: string, unsplashSlug: string, hue: string): Photo => ({
  id,
  url: `https://images.unsplash.com/photo-${unsplashSlug}?auto=format&fit=crop&w=800&h=1000&q=80`,
  alt: "Profile photo",
  blurDataUrl: `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="50"><rect fill="${hue}" width="40" height="50"/></svg>`
  )}`,
});

/** Hero uses [0]; sheet insets [1]–[3]; with 5+ photos, [4] appears after “What caught our eye”. */
export const mockPhotos = {
  elena: [
    womanPhoto("elena-1", "1494790108377-be9c29b29330", "#d4cfc8"),
    womanPhoto("elena-2", "1438761681033-6461ffad8d80", "#c9c4bd"),
    womanPhoto("elena-3", "1506794778202-cad84cf45f1d", "#beb9b2"),
    womanPhoto("elena-4", "1524504388940-b1c1722653e1", "#b2ada8"),
    womanPhoto("elena-5", "1519741439780-061909cbd34", "#a8a39e"),
  ],
  noah: [
    womanPhoto("noah-1", "1544005313-94ddf0286df2", "#c5ccc4"),
    womanPhoto("noah-2", "1534528741775-53994a69daeb", "#b8bfb7"),
    womanPhoto("noah-3", "1500648762291-cebe109663d1", "#abb2aa"),
    womanPhoto("noah-4", "1499552736789-c8154b69835b", "#9ea59d"),
    womanPhoto("noah-5", "1589156222653-3246135dde2", "#919892"),
  ],
  mira: [
    womanPhoto("mira-1", "1488426862026-3ee34a7d66df", "#d8d0cf"),
    womanPhoto("mira-2", "1529626455594-4ff0802cfb7e", "#cbc3c2"),
    womanPhoto("mira-3", "1531746020798-e6953c6e8e04", "#beb6b5"),
    womanPhoto("mira-4", "1507003211169-0a1dd7228f2d", "#b1a9a8"),
    womanPhoto("mira-5", "1545239351-29a388d56a91", "#a4a09c"),
  ],
  james: [
    womanPhoto("james-1", "1592621385612-4d7129426394", "#cfd5d0"),
    womanPhoto("james-2", "1594744803329-e58b31de8bf5", "#c2c8c3"),
    womanPhoto("james-3", "1515886657613-9f3515b0c78f", "#b5bbb6"),
    womanPhoto("james-4", "1529626455594-4ff0802cfb7e", "#a8aea9"),
    womanPhoto("james-5", "1472094159878-1e6fa9baa21b", "#9ba19d"),
  ],
  sofia: [
    womanPhoto("sofia-1", "1517841905240-472988babdf9", "#dcd6d4"),
    womanPhoto("sofia-2", "1526510747491-58ed92862094", "#cfc9c7"),
    womanPhoto("sofia-3", "1487412720507-e7ab37603c6f", "#c2bcb9"),
    womanPhoto("sofia-4", "1573496359142-b8d87734a5a2", "#b5afac"),
    womanPhoto("sofia-5", "1519741439780-061909cbd34", "#a8a39e"),
  ],
  alex: [
    womanPhoto("alex-1", "1507003211169-0a1dd7228f2d", "#d0d4d8"),
    womanPhoto("alex-2", "1515886657613-9f3515b0c78f", "#c3c7cb"),
    womanPhoto("alex-3", "1545912452-8aa7a3b87326", "#b6babf"),
    womanPhoto("alex-4", "1522337094842-7a251cfe0b88", "#a9adb2"),
    womanPhoto("alex-5", "1589156222653-3246135dde2", "#9ca0a5"),
  ],
  self: [
    womanPhoto("self-1", "1487412720507-e7ab37603c6f", "#e2dedc"),
    womanPhoto("self-2", "1573496359142-b8d87734a5a2", "#d5d1cf"),
    womanPhoto("self-3", "1506794778202-cad84cf45f1d", "#c8c4c2"),
    womanPhoto("self-4", "1524504388940-b1c1722653e1", "#bbb7b5"),
    womanPhoto("self-5", "1545239351-29a388d56a91", "#aeaaa8"),
  ],
  zoe: [
    womanPhoto("zoe-1", "1580489944761-15a19d654956", "#ddd8d4"),
    womanPhoto("zoe-2", "1517841905240-472988babdf9", "#d0cbc7"),
    womanPhoto("zoe-3", "1438761681033-6461ffad8d80", "#c3beb9"),
    womanPhoto("zoe-4", "1494790108377-be9c29b29330", "#b6b1ac"),
    womanPhoto("zoe-5", "1472094159878-1e6fa9baa21b", "#a9a49f"),
  ],
  priya: [
    womanPhoto("priya-1", "1506794778202-cad84cf45f1d", "#d8d2ce"),
    womanPhoto("priya-2", "1545912452-8aa7a3b87326", "#ccc6c2"),
    womanPhoto("priya-3", "1531746020798-e6953c6e8e04", "#bfb9b5"),
    womanPhoto("priya-4", "1500648762291-cebe109663d1", "#b2aca8"),
    womanPhoto("priya-5", "1519741439780-061909cbd34", "#a5a19d"),
  ],
  lin: [
    womanPhoto("lin-1", "1544005313-94ddf0286df2", "#ded9d5"),
    womanPhoto("lin-2", "1534528741775-53994a69daeb", "#d1ccc8"),
    womanPhoto("lin-3", "1551835502-4c7c57d0a7a7", "#c4bfb9"),
    womanPhoto("lin-4", "1522337094842-7a251cfe0b88", "#b7b2ac"),
    womanPhoto("lin-5", "1589156222653-3246135dde2", "#aaa59f"),
  ],
  riley: [
    womanPhoto("riley-1", "1488426862026-3ee34a7d66df", "#d5d0cc"),
    womanPhoto("riley-2", "1529626455594-4ff0802cfb7e", "#c8c3bf"),
    womanPhoto("riley-3", "1580489944761-15a19d654956", "#bbb6b2"),
    womanPhoto("riley-4", "1515886657613-9f3515b0c78f", "#aea9a5"),
    womanPhoto("riley-5", "1545239351-29a388d56a91", "#a19c97"),
  ],
  nora: [
    womanPhoto("nora-1", "1551835502-4c7c57d0a7a7", "#dcd7d3"),
    womanPhoto("nora-2", "1522337094842-7a251cfe0b88", "#cfcac6"),
    womanPhoto("nora-3", "1499552736789-c8154b69835b", "#c2bdb9"),
    womanPhoto("nora-4", "1531746020798-e6953c6e8e04", "#b5b0ac"),
    womanPhoto("nora-5", "1472094159878-1e6fa9baa21b", "#a8a39e"),
  ],
} satisfies Record<string, Photo[]>;
