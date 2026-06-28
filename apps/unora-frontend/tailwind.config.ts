import type { Config } from "tailwindcss";

/**
 * Semantic colors read CSS variables from `src/styles/theme-variables.css`.
 * Add presets there (`[data-theme="…"]`) — keep variable names aligned with this map.
 */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        unora: {
          ink: "rgb(var(--u-ink) / <alpha-value>)",
          mist: "rgb(var(--u-mist) / <alpha-value>)",
          cloud: "rgb(var(--u-cloud) / <alpha-value>)",
          snow: "rgb(var(--u-snow) / <alpha-value>)",
          line: "rgb(var(--u-line) / <alpha-value>)",
          rose: "rgb(var(--u-rose) / <alpha-value>)",
          blush: "rgb(var(--u-blush) / <alpha-value>)",
          sage: "rgb(var(--u-sage) / <alpha-value>)",
          "sage-muted": "rgb(var(--u-sage-muted) / <alpha-value>)",
          accent: "rgb(var(--u-accent) / <alpha-value>)",
          brand: "rgb(var(--u-brand) / <alpha-value>)",
          "brand-strong": "rgb(var(--u-brand-strong) / <alpha-value>)",
          /** App shell / canvas gradient endpoints — mirror `theme-variables.css` */
          "canvas-from": "rgb(var(--u-canvas-from) / <alpha-value>)",
          "canvas-via": "rgb(var(--u-canvas-via) / <alpha-value>)",
          "canvas-to": "rgb(var(--u-canvas-to) / <alpha-value>)",
        },
      },
      maxWidth: {
        /** Narrow “phone” column — intentional, not dashboard-wide */
        app: "30rem",
      },
      spacing: {
        "app-1": "0.25rem",
        "app-2": "0.5rem",
        "app-3": "0.75rem",
        "app-4": "1rem",
        "app-5": "1.25rem",
        "app-6": "1.5rem",
        "app-8": "2rem",
        "app-10": "2.5rem",
        "app-12": "3rem",
        /** Bottom inset above floating tab bar + safe area */
        "app-nav": "5.75rem",
      },
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "sans-serif",
        ],
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
      },
      fontSize: {
        /** Slightly larger body for premium mobile readability */
        body: ["0.9375rem", { lineHeight: "1.65" }],
      },
      boxShadow: {
        soft: "0 1px 3px rgb(var(--u-ink) / 0.05)",
        card: "0 1px 2px rgb(var(--u-ink) / 0.04), 0 10px 28px rgb(var(--u-ink) / 0.07)",
        lift: "0 6px 18px rgb(var(--u-ink) / 0.08)",
        nav: "0 -4px 24px rgb(var(--u-ink) / 0.06)",
        phone: "0 24px 48px rgb(var(--u-ink) / 0.12)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        /** One-shot border glow for inline notices (Discover like gate, etc.). */
        noticeBorderEmphasis: {
          "0%": {
            borderColor: "rgb(var(--u-brand-strong) / 0.55)",
            boxShadow: "0 0 0 2px rgb(var(--u-brand) / 0.28)",
          },
          "55%": {
            borderColor: "rgb(var(--u-brand-strong) / 0.35)",
            boxShadow: "0 0 0 5px rgb(var(--u-brand) / 0.1)",
          },
          "100%": {
            borderColor: "rgb(var(--u-line) / 0.9)",
            boxShadow: "0 1px 3px rgb(var(--u-ink) / 0.05)",
          },
        },
        /** Login welcome title: inline heart gently breathes (layout box fixed in markup). */
        welcomeLoveHeartPulse: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.12)" },
        },
        /** Login hero: heart blooms with glow, then lifts away */
        loginHeartIntro: {
          "0%": {
            opacity: "0",
            transform: "translateY(0.6rem) scale(0.88)",
            filter: "drop-shadow(0 0 0 transparent)",
          },
          "14%": {
            opacity: "1",
            transform: "translateY(0) scale(1)",
            filter: "drop-shadow(0 0 14px rgb(var(--u-rose) / 0.55))",
          },
          "32%": {
            transform: "translateY(0) scale(1.14)",
            filter: "drop-shadow(0 0 32px rgb(var(--u-brand-strong) / 0.72))",
          },
          "48%": {
            transform: "translateY(0) scale(1)",
            filter: "drop-shadow(0 0 20px rgb(var(--u-rose) / 0.6))",
          },
          "100%": {
            opacity: "0",
            transform: "translateY(-3.5rem) scale(1.42)",
            filter: "drop-shadow(0 0 4px transparent)",
          },
        },
      },
      animation: {
        shimmer: "shimmer 2s ease-in-out infinite",
        "notice-border-emphasis":
          "noticeBorderEmphasis 1.15s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "login-heart-intro":
          "loginHeartIntro 2.85s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "welcome-love-heart":
          "welcomeLoveHeartPulse 1.65s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
