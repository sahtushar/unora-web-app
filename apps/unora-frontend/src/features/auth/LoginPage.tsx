import {useMemo, useState, type ReactNode} from "react";

import {useMutation} from "@tanstack/react-query";
import {Heart} from "lucide-react";
import {Navigate, useLocation, useNavigate} from "react-router-dom";

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

function SoftBubble({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "absolute flex items-center justify-center rounded-full border border-white/20 bg-unora-snow/92 shadow-soft ring-1 ring-black/10",
        className
      )}>
      {children}
    </div>
  );
}

function TreeGraphic({className}: {className?: string}) {
  return (
    <svg className={cn("h-full w-full", className)} viewBox="0 0 120 120" aria-hidden>
      <path d="M56 67h9l5 34H51l5-34z" fill="#9B6B56" />
      <circle cx="60" cy="43" r="25" fill="#7FCAC2" />
      <circle cx="42" cy="58" r="22" fill="#8ED7C7" />
      <circle cx="79" cy="58" r="22" fill="#6FB9A9" />
      <path
        d="M50 76c8-4 14-4 22 0"
        stroke="#2A252B"
        strokeLinecap="round"
        strokeWidth="4"
        opacity="0.28"
        fill="none"
      />
    </svg>
  );
}

function SunflowerGraphic({className}: {className?: string}) {
  return (
    <svg className={cn("h-full w-full", className)} viewBox="0 0 120 120" aria-hidden>
      <path d="M59 66c-5 12-5 25-2 38" stroke="#6EA083" strokeWidth="6" strokeLinecap="round" />
      <path d="M58 88c-10-9-19-11-29-7 9 9 19 11 29 7z" fill="#7FCAC2" opacity="0.9" />
      <path d="M63 84c9-10 18-13 29-10-8 10-18 14-29 10z" fill="#8BCFBF" opacity="0.85" />
      {Array.from({length: 10}).map((_, index) => {
        const angle = (index * 36 * Math.PI) / 180;
        const x = 60 + Math.cos(angle) * 24;
        const y = 45 + Math.sin(angle) * 24;
        return (
          <ellipse
            key={index}
            cx={x}
            cy={y}
            rx="9"
            ry="16"
            fill="#F4C95D"
            transform={`rotate(${index * 36} ${x} ${y})`}
          />
        );
      })}
      <circle cx="60" cy="45" r="17" fill="#9B6B56" />
      <circle cx="54" cy="41" r="2.5" fill="#2A252B" opacity="0.45" />
      <circle cx="66" cy="41" r="2.5" fill="#2A252B" opacity="0.45" />
      <path d="M53 50c4 4 10 4 14 0" stroke="#2A252B" strokeLinecap="round" strokeWidth="3" opacity="0.45" fill="none" />
    </svg>
  );
}

function SmartphoneGraphic({className}: {className?: string}) {
  return (
    <svg className={cn("h-full w-full", className)} viewBox="0 0 120 120" aria-hidden>
      <rect x="35" y="15" width="50" height="90" rx="15" fill="#2A252B" />
      <rect x="40" y="24" width="40" height="68" rx="9" fill="#FAF9FC" />
      <circle cx="60" cy="98" r="3" fill="#FAF9FC" opacity="0.85" />
      <path
        d="M60 73c-.5-.5-17-11.3-17-24.3 0-6.5 4.3-10.5 9.7-10.5 3.5 0 6.1 1.8 7.3 4.5 1.2-2.7 3.8-4.5 7.3-4.5 5.4 0 9.7 4 9.7 10.5C77 61.7 60.5 72.5 60 73z"
        fill="#B88F8C"
      />
    </svg>
  );
}

function HeartBubbleGraphic({className}: {className?: string}) {
  return (
    <svg
      className={cn("h-full w-full", className)}
      viewBox="0 0 120 120"
      aria-hidden>
      <circle cx="60" cy="60" r="47" fill="#F3DBD7" opacity="0.9" />
      <path
        d="M60 79c-.6-.6-24-16-24-34.4C36 35.5 42 30 49.5 30c4.9 0 8.6 2.6 10.5 6.4C61.9 32.6 65.6 30 70.5 30 78 30 84 35.5 84 44.6 84 63 60.6 78.4 60 79z"
        fill="#B88F8C"
      />
      <path
        d="M45 88c10 6 20 6 30 0"
        stroke="#fff"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />
    </svg>
  );
}

function FloatingHeart({className}: {className?: string}) {
  return (
    <svg className={cn("absolute text-unora-brand-strong", className)} viewBox="0 0 40 40" aria-hidden>
      <path
        d="M20 30.5c-.5-.5-12-8-12-17.1C8 8.8 11 6 14.8 6c2.4 0 4.2 1.3 5.2 3.2C21 7.3 22.8 6 25.2 6 29 6 32 8.8 32 13.4c0 9.1-11.5 16.6-12 17.1z"
        fill="currentColor"
        opacity="0.82"
      />
    </svg>
  );
}

function LoginGardenGraphic() {
  return (
    <section className="relative h-[21rem] shrink-0 overflow-hidden bg-unora-ink text-white">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_24%,rgba(184,143,140,0.24),transparent_34%),radial-gradient(circle_at_18%_20%,rgba(127,202,194,0.18),transparent_26%),linear-gradient(180deg,rgba(42,37,43,0.94)_0%,rgba(42,37,43,1)_72%,rgba(250,249,252,1)_100%)]"
        aria-hidden
      />
      <div className="absolute inset-x-0 top-[max(env(safe-area-inset-top),1.65rem)] z-[2] flex justify-center">
        <div className="flex items-center gap-app-2 text-unora-snow">
          <UnoraMarkIcon
            variant="theme"
            className="h-7 w-7 shrink-0 text-unora-brand"
            aria-hidden
          />
          <span className="font-display text-base font-semibold uppercase">
            {a.brandName}
          </span>
        </div>
      </div>

      <SoftBubble className="-left-8 top-12 h-24 w-24 rotate-[-8deg] opacity-90">
        <TreeGraphic className="p-3" />
      </SoftBubble>
      <SoftBubble className="left-12 top-[7.7rem] h-24 w-24 rotate-[6deg]">
        <SunflowerGraphic className="p-2" />
      </SoftBubble>
      <SoftBubble className="left-1/2 top-[4.7rem] h-36 w-36 -translate-x-1/2">
        <SmartphoneGraphic className="p-4" />
      </SoftBubble>
      <SoftBubble className="-right-7 top-[4.2rem] h-24 w-24 rotate-[10deg] opacity-90">
        <HeartBubbleGraphic className="p-2" />
      </SoftBubble>
      <SoftBubble className="bottom-8 left-5 h-20 w-20 rotate-[8deg] opacity-70 grayscale">
        <TreeGraphic className="p-3" />
      </SoftBubble>
      <SoftBubble className="bottom-5 right-12 h-24 w-24 rotate-[-7deg] opacity-85">
        <SunflowerGraphic className="p-2" />
      </SoftBubble>

      <span
        className="absolute left-[18%] top-[52%] h-8 w-8 rounded-full border border-white/15 bg-white/10 shadow-soft"
        aria-hidden
      />
      <span
        className="absolute right-[17%] top-[36%] h-5 w-5 rounded-full border border-white/20 bg-white/15"
        aria-hidden
      />
      <span
        className="absolute left-[58%] top-[42%] h-3 w-3 rounded-full bg-unora-brand/70"
        aria-hidden
      />
      <FloatingHeart className="left-[14%] top-[47%] h-7 w-7 rotate-[-14deg] opacity-80" />
      <FloatingHeart className="right-[24%] top-[48%] h-6 w-6 rotate-[10deg] opacity-75" />
      <FloatingHeart className="left-[47%] bottom-[18%] h-9 w-9 opacity-85" />

      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-unora-snow" />
    </section>
  );
}

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() ?? "";

export default function LoginPage() {
  const {isAuthenticated, signIn} = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState<string | null>(null);
  const [googleBusy, setGoogleBusy] = useState(false);

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
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-unora-snow text-unora-ink">
      <LoginGardenGraphic />

      <main className="relative z-[1] -mt-app-8 flex flex-1 flex-col rounded-t-[2rem] bg-unora-snow px-app-4 pb-app-4 pt-app-8 sm:px-app-6">
        <div className="mx-auto flex w-full max-w-[22rem] flex-1 flex-col items-center text-center">
          <section className="w-full space-y-app-7">
            <div className="space-y-app-4">
              <h1 className="mx-auto max-w-[20.5rem] text-balance font-display text-[2.1rem] font-semibold leading-[1.06] text-unora-ink sm:text-[2.35rem]">
                One lane for{" "}
                <span
                  className="inline-flex items-center gap-[0.03em] text-unora-brand-strong"
                  aria-label={a.welcomeTitle.loveAriaLabel}>
                  <span aria-hidden="true">l</span>
                  <span
                    aria-hidden
                    className="inline-flex h-[0.65em] w-[0.65em] shrink-0 translate-y-[0.03em] items-center justify-center">
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
                  <span aria-hidden="true">ve</span>
                </span>
                 Free to begin with{" "}
                <span className="text-unora-brand-strong">intention</span>.
              </h1>
              <p className="mx-auto max-w-[19.5rem] text-balance font-sans text-[1rem] leading-relaxed text-unora-mist">
                Sign in or create an account - calm, intentional, and yours to
                control.
              </p>
            </div>

            <div className="space-y-app-3 pt-app-1">
              {googleClientId.length > 0 ? (
                <div className="mx-auto flex min-h-12 w-full max-w-[21.5rem] justify-center rounded-full bg-white shadow-soft ring-1 ring-unora-line/80">
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
                <Button
                  type="button"
                  variant="primary"
                  size="pill"
                  className="relative h-14 justify-center rounded-full bg-unora-brand-strong text-[15px] font-semibold text-white shadow-soft hover:bg-unora-brand-strong/90"
                  disabled={busy}
                  onClick={() => googleMutation.mutate()}>
                  <span
                    aria-hidden
                    className="absolute left-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                    <GoogleGlyph className="h-5 w-5" />
                  </span>
                  {a.continueGoogle}
                </Button>
              )}
            </div>

            {formError !== null && (
              <p className="rounded-2xl border border-red-200/80 bg-red-50/80 px-app-3 py-app-2 text-center text-xs text-red-900/90">
                {formError}
              </p>
            )}
          </section>

          <footer className="mt-auto w-full pb-app-1 pt-app-8 text-center">
            <p className="mx-auto max-w-[22rem] text-[11px] leading-relaxed text-unora-mist">
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
      </main>
    </div>
  );
}
