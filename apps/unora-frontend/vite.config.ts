import path from "node:path";
import {fileURLToPath} from "node:url";

import react from "@vitejs/plugin-react";
import {VitePWA} from "vite-plugin-pwa";
import {defineConfig, loadEnv} from "vite";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const monorepoRootDir = path.resolve(rootDir, "../..");

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, monorepoRootDir, "VITE_");
  const rawApi = env.VITE_API_URL?.trim() ?? "";
  const proxyTarget = /^https?:\/\//i.test(rawApi)
    ? rawApi.replace(/\/$/, "")
    : "http://127.0.0.1:8000";

  return {
    envDir: monorepoRootDir,
    /** Top-level `await` in `main.tsx` needs ES2022+; aligns with `tsconfig.app` target. */
    build: {
      target: "es2022",
    },
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["unora-mark.svg"],
        /**
         * Precache the built app shell. Runtime caching below stores `<img>` / image requests
         * in Cache Storage (stale-while-revalidate) for repeat navigation.
         */
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,svg,woff2}"],
          runtimeCaching: [
            {
              urlPattern: ({request}) => request.destination === "image",
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "unora-images",
                expiration: {
                  maxEntries: 200,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        manifest: {
          name: "Unora",
          short_name: "Unora",
          description: "A calm, intentional way to connect.",
          theme_color: "#faf9fc",
          background_color: "#faf9fc",
          display: "standalone",
          scope: "/",
          start_url: "/",
          icons: [
            {
              src: "/unora-mark.svg",
              type: "image/svg+xml",
              sizes: "any",
              purpose: "any",
            },
          ],
        },
        devOptions: {
          enabled: false,
        },
      }),
    ],
    server: {
      port: 3000,
      /**
       * Same-origin `/v1/...` avoids `ERR_BLOCKED_BY_RESPONSE.NotSameOrigin` when the API
       * sends `Cross-Origin-Resource-Policy: same-origin` on media (fine for direct tab opens,
       * blocked for `<img>` from another port). See `resolveMediaUrl`.
       */
      proxy: {
        "/v1": {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(rootDir, "src"),
      },
    },
  };
});
