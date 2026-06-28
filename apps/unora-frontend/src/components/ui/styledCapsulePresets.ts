/**
 * Theme-token capsule presets (background + text + optional ring / blur).
 * Use with {@link StyledCapsule} — keeps surfaces on `unora.*` tokens.
 */
export const styledCapsuleCombos = {
  /** Dark glass on photos / dark imagery (e.g. verified badge on hero). */
  heroOnPhoto: {
    bg: "bg-black/55",
    text: "text-white",
    ring: "ring-1 ring-white/20",
    extras: "backdrop-blur-md",
  },
  /** Neutral chip on light surfaces. */
  cloudInk: {
    bg: "bg-unora-cloud/95",
    text: "text-unora-ink",
    ring: "ring-1 ring-unora-line/55",
    extras: "",
  },
  /** Soft brand wash. */
  blushBrand: {
    bg: "bg-unora-blush/85",
    text: "text-unora-brand-strong",
    ring: "ring-1 ring-unora-brand/25",
    extras: "",
  },
  /** Muted label on snow. */
  snowMuted: {
    bg: "bg-unora-snow/95",
    text: "text-unora-mist",
    ring: "ring-1 ring-unora-line/60",
    extras: "",
  },
  /** Strong brand pill (light text). */
  brandSnow: {
    bg: "bg-unora-brand-strong/92",
    text: "text-unora-snow",
    ring: "ring-1 ring-unora-brand/35",
    extras: "",
  },
} as const;

export type StyledCapsuleCombo = keyof typeof styledCapsuleCombos;
