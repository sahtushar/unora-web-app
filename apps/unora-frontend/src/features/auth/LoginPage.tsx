import {useEffect, useLayoutEffect, useMemo, useState} from "react";

import {useMutation} from "@tanstack/react-query";
import {Heart} from "lucide-react";
import {Navigate, useLocation, useNavigate} from "react-router-dom";

import loginHero from "@/assets/auth/login-hero.png";
import {UnoraMarkIcon} from "@/components/icons/UnoraMarkIcon";
import {Button} from "@/components/ui";
import {cn} from "@/lib/cn";
import {routes} from "@/lib/routes";
import {mockSignInWithGoogle} from "@/services/authService";

import {strings} from "../strings";
import {GoogleSignInWidget} from "./GoogleSignInWidget";
import {authErrorMessage} from "./authErrorMessages";
import {signInWithGoogle} from "./googleAuth";
import {useAuth} from "./useAuth";

const a = strings.auth;

function GoogleGlyph({className}: {className?: string}) {
  return (
    <svg
      className={cn("h-5 w-5 shrink-0", className)}
      viewBox="0 0 24 24"
      aria-hidden>
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.4H12v4.5h6.5c-.3 1.6-1.2 3-2.6 3.9v3.2h4.2c2.5-2.3 3.9-5.7 3.9-9.7z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 6-1.1 8-2.9l-4.2-3.2c-1.1.8-2.5 1.2-3.8 1.2-2.9 0-5.4-2-6.3-4.6H1.5v3.3C3.5 21.4 7.5 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.7 14.5c-.2-.6-.4-1.2-.4-1.9s.1-1.3.4-1.9V7.4H1.5C.5 9.3 0 11.6 0 14s.5 4.7 1.5 6.6l4.2-3.3z"
      />
      <path
        fill="#EA4335"
        d="M12 4.8c1.6 0 3.1.6 4.2 1.6l3.1-3.1C17.9 1.2 15.2 0 12 0 7.5 0 3.5 2.6 1.5 6.6l4.2 3.3c.9-2.6 3.4-4.6 6.3-4.6z"
      />
    </svg>
  );
}

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() ?? "";

const HEART_INTRO_MS = 2900;

export default function LoginPage() {
  const {isAuthenticated, signIn} = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState<string | null>(null);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [showHeartIntro, setShowHeartIntro] = useState(true);

  useLayoutEffect(() => {
    if (globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShowHeartIntro(false);
    }
  }, []);

  useEffect(() => {
    if (!showHeartIntro) {
      return;
    }
    const id = globalThis.setTimeout(
      () => setShowHeartIntro(false),
      HEART_INTRO_MS
    );
    return () => globalThis.clearTimeout(id);
  }, [showHeartIntro]);

  const redirectTo = useMemo(() => {
    const from = (location.state as {from?: string} | null)?.from;
    if (
      from !== undefined &&
      from.length > 0 &&
      from !== routes.login &&
      from.startsWith("/")
    ) {
      return from;
    }
    return routes.discover;
  }, [location.state]);

  const googleMutation = useMutation({
    mutationFn: mockSignInWithGoogle,
    onSuccess: (session) => {
      setFormError(null);
      signIn({accessToken: session.accessToken});
      navigate(redirectTo, {replace: true});
    },
    onError: () => setFormError(a.googleError),
  });

  if (isAuthenticated) {
    return <Navigate to={routes.discover} replace />;
  }

  const busy = googleMutation.isPending || googleBusy;
  const L = a.legal;

  return (
    <div className="flex min-h-0 flex-1 flex-col text-unora-ink">
      <div className="relative shrink-0 px-app-4">
        <div
          className={cn(
            "relative mx-auto w-full max-w-md overflow-hidden rounded-[1.65rem]",
            "shadow-lift ring-1 ring-unora-line/65"
          )}>
          <div className="relative aspect-[5/6] max-h-[min(40vh,21.5rem)] w-full sm:aspect-[4/5] sm:max-h-[min(42vh,23rem)]">
            <img
              src={loginHero}
              alt=""
              className="h-full w-full object-cover object-[center_26%]"
              decoding="async"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-unora-ink/[0.04] via-transparent to-unora-snow"
              aria-hidden
            />
            {showHeartIntro ? (
              <div
                className="pointer-events-none absolute inset-0 flex items-center justify-center motion-reduce:hidden"
                aria-hidden>
                <Heart
                  strokeWidth={1.15}
                  className={cn(
                    "h-[clamp(2.85rem,12vw,3.85rem)] w-[clamp(2.85rem,12vw,3.85rem)]",
                    "fill-unora-brand-strong text-unora-brand-strong",
                    "animate-login-heart-intro will-change-[transform,opacity,filter]"
                  )}
                  onAnimationEnd={() => setShowHeartIntro(false)}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="relative z-[1] -mt-app-6 flex flex-1 flex-col px-app-4 pb-app-2 pt-app-8 sm:-mt-app-8 sm:pt-app-10">
        <div className="mx-auto w-full max-w-[22rem] space-y-app-10 text-center">
          <div className="space-y-app-6">
            <div className="flex items-center justify-center gap-app-3 sm:gap-app-4">
              <UnoraMarkIcon
                className="h-[3.25rem] w-[3.25rem] shrink-0 text-unora-brand-strong sm:h-[3.5rem] sm:w-[3.5rem]"
                aria-hidden
              />
              <p className="font-display text-[1.75rem] font-semibold leading-none tracking-tight text-unora-ink sm:text-[2rem]">
                {a.brandName}
              </p>
            </div>
            <div className="space-y-app-3">
              <h1 className="text-balance font-display text-[1.38rem] font-medium leading-snug tracking-[-0.02em] text-unora-ink sm:text-[1.65rem] sm:leading-tight">
                {a.welcomeTitle.lead}
                <span
                  className="inline-flex items-center gap-[0.04em] font-semibold text-unora-brand-strong"
                  aria-label={a.welcomeTitle.loveAriaLabel}>
                  <span aria-hidden="true" className="leading-none">
                    {a.welcomeTitle.loveLeft}
                  </span>
                  <span
                    aria-hidden
                    className="inline-flex h-[0.68em] w-[0.68em] shrink-0 translate-y-[0.04em] items-center justify-center">
                    <Heart
                      aria-hidden
                      className={cn(
                        "h-full w-full origin-center fill-current text-unora-brand-strong",
                        "motion-safe:animate-welcome-love-heart will-change-transform motion-reduce:animate-none motion-reduce:will-change-auto"
                      )}
                      fill="currentColor"
                      strokeWidth={2}
                    />
                  </span>
                  <span aria-hidden="true" className="leading-none">
                    {a.welcomeTitle.loveRight}
                  </span>
                </span>
                {a.welcomeTitle.bridge}
                <span className="font-semibold text-unora-brand-strong">
                  {a.welcomeTitle.intention}
                </span>
                {a.welcomeTitle.end}
              </h1>
              <p className="text-balance font-sans text-[0.9375rem] font-normal leading-relaxed tracking-[0.01em] text-unora-mist/95 sm:text-sm">
                {a.welcomeSubtitle}
              </p>
            </div>
          </div>

          <div className="space-y-app-4">
            {googleClientId.length > 0 ? (
              <div className="mx-auto flex w-full max-w-[21.5rem] justify-center">
                <GoogleSignInWidget
                  clientId={googleClientId}
                  disabled={busy}
                  onCredential={async (idToken) => {
                    setGoogleBusy(true);
                    setFormError(null);
                    try {
                      const bundle = await signInWithGoogle(idToken);
                      signIn({
                        accessToken: bundle.accessToken,
                        refreshToken: bundle.refreshToken,
                      });
                      navigate(redirectTo, {replace: true});
                    } catch (e) {
                      setFormError(authErrorMessage(e));
                    } finally {
                      setGoogleBusy(false);
                    }
                  }}
                />
              </div>
            ) : (
              <div className="mx-auto w-full max-w-[21.5rem]">
                <Button
                  type="button"
                  variant="google"
                  size="pill"
                  className="justify-start gap-app-4 pl-app-5 pr-app-6"
                  disabled={busy}
                  onClick={() => googleMutation.mutate()}>
                  <span
                    aria-hidden
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/90 shadow-sm ring-1 ring-unora-line/50">
                    <GoogleGlyph className="h-[1.15rem] w-[1.15rem]" />
                  </span>
                  {a.continueGoogle}
                </Button>
              </div>
            )}
          </div>

          {formError !== null && (
            <p className="rounded-2xl border border-red-200/80 bg-red-50/80 px-app-3 py-app-2 text-center text-xs text-red-900/90">
              {formError}
            </p>
          )}
        </div>
      </div>

      <footer className="mt-auto px-app-4 pb-app-3 pt-app-8 text-center sm:pb-app-4">
        <p className="text-[11px] leading-relaxed text-unora-mist">
          {L.prefix}{" "}
          <a
            className="font-medium text-unora-ink underline underline-offset-2 transition-opacity hover:opacity-80"
            href="#">
            {L.terms}
          </a>
          {L.mid}{" "}
          <a
            className="font-medium text-unora-ink underline underline-offset-2 transition-opacity hover:opacity-80"
            href="#">
            {L.privacy}
          </a>
          {L.suffix}
        </p>
      </footer>
    </div>
  );
}
