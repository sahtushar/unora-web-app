/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  /** OAuth 2.0 Web client ID from Google Cloud Console (GIS). */
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  /** Public Mapbox token for client-side Geocoding API (see `locationAutocomplete.ts`). */
  readonly VITE_MAPBOX_ACCESS_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt: () => Promise<void>;
}

interface Navigator {
  standalone?: boolean;
}
