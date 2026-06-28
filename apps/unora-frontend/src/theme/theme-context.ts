import {createContext} from "react";

import type {ThemeId} from "./themeIds";

export type ThemeContextValue = {
  themeId: ThemeId;
  setTheme: (id: ThemeId) => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);
