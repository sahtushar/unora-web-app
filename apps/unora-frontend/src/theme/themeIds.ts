export const THEME_IDS = ["default", "ember", "tide", "grove"] as const;

export type ThemeId = (typeof THEME_IDS)[number];

export const THEME_STORAGE_KEY = "unora_theme_id";

export const THEME_LABELS: Record<ThemeId, {hint: string; title: string}> = {
  default: {title: "Unora", hint: "Balanced neutrals with a soft rose accent."},
  ember: {title: "Ember", hint: "Warmer coral tones — cozy and romantic."},
  tide: {title: "Tide", hint: "Cool slate blues — calm and modern."},
  grove: {
    title: "Grove",
    hint: "Deep forest greens — grounded and serene.",
  },
};

/** Browser `theme-color` (approximate surface) per preset */
export const THEME_COLOR_HEX: Record<ThemeId, string> = {
  default: "#faf9fc",
  ember: "#fffcfa",
  tide: "#f8fafc",
  grove: "#f8faf8",
};
