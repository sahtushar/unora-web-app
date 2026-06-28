import type {ThemeId} from "./themeIds";

/**
 * Theme picker tiles on Profile — fills use washes from
 * `src/styles/theme-variables.css` so each option reads like its preset.
 */
export type ThemeSelectAppearance = {
  /** “Active” label — preset `brand-strong` */
  activeBadge: string;
  /** Tile fill — preset `blush` (tinted canvas) */
  background: string;
  /** Inset ring when selected — preset `ink` */
  selectionRing: string;
  /** Title — preset `ink` */
  title: string;
};

export const THEME_SELECT_APPEARANCE: Record<ThemeId, ThemeSelectAppearance> = {
  default: {
    background: "239 230 228",
    title: "26 26 31",
    selectionRing: "26 26 31",
    activeBadge: "175 130 125",
  },
  ember: {
    background: "252 236 232",
    title: "32 26 26",
    selectionRing: "32 26 26",
    activeBadge: "178 96 82",
  },
  tide: {
    background: "232 238 245",
    title: "22 28 38",
    selectionRing: "22 28 38",
    activeBadge: "88 118 148",
  },
  grove: {
    background: "230 238 233",
    title: "24 32 28",
    selectionRing: "24 32 28",
    activeBadge: "72 108 88",
  },
};
