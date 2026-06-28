import {
  type ReactNode,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

import {ThemeContext, type ThemeContextValue} from "./theme-context";
import {
  THEME_COLOR_HEX,
  THEME_IDS,
  THEME_STORAGE_KEY,
  type ThemeId,
} from "./themeIds";

function readStoredTheme(): ThemeId {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (raw && (THEME_IDS as readonly string[]).includes(raw)) {
      return raw as ThemeId;
    }
  } catch {
    /* ignore */
  }
  return "default";
}

function applyThemeToDocument(themeId: ThemeId) {
  const root = document.documentElement;
  if (themeId === "default") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", themeId);
  }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", THEME_COLOR_HEX[themeId]);
  }
}

export function ThemeProvider({children}: {children: ReactNode}) {
  const [themeId, setThemeIdState] = useState<ThemeId>(() => readStoredTheme());

  useLayoutEffect(() => {
    applyThemeToDocument(themeId);
  }, [themeId]);

  const setTheme = useCallback((id: ThemeId) => {
    setThemeIdState(id);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, id);
    } catch {
      /* ignore */
    }
    applyThemeToDocument(id);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({themeId, setTheme}),
    [themeId, setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
