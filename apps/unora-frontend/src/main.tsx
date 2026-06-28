import {StrictMode} from "react";

import {createRoot} from "react-dom/client";

import {App} from "./app/App";
import {AppProviders} from "./app/providers/AppProviders";
import "./index.css";

/** Service worker + image Cache Storage; only in production (see `vite.config.ts` `VitePWA` / `devOptions.enabled`). */
if (import.meta.env.PROD) {
  const {registerSW} = await import("virtual:pwa-register");
  registerSW({immediate: true});
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>
);
