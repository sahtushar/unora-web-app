import {useId, useState} from "react";

import {ChevronDown, CircleUser, Palette} from "lucide-react";
import {useNavigate} from "react-router-dom";

import {Avatar, Button, Card, ScreenSkeleton, Section} from "@/components/ui";
import {useAuth} from "@/features/auth/useAuth";
import {useCurrentUser} from "@/hooks/useCurrentUser";
import {cn} from "@/lib/cn";
import {routes} from "@/lib/routes";
import {THEME_SELECT_APPEARANCE} from "@/theme/themeAppearanceSelect";
import {THEME_IDS, THEME_LABELS} from "@/theme/themeIds";
import {useTheme} from "@/theme/useTheme";

import {strings} from "../strings";
import {profileCreationSectionDividerClass} from "./sectionDivider";

const p = strings.profile;

function HelpIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M9.5 9a2.5 2.5 0 0 1 4.56-1.38c.59.98.32 2.14-.66 2.66l-.4.22c-.48.27-.78.78-.78 1.35V13"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="12" cy="17.2" r="0.9" fill="currentColor" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VerifiedBadge() {
  return (
    <span
      className="inline-flex shrink-0 text-unora-brand-strong"
      title={p.summary.verifiedAria}
      aria-label={p.summary.verifiedAria}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="currentColor"
          className="text-unora-brand-strong/15"
        />
        <path
          d="M8.5 12.5l2.2 2.2L15.5 9.9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function ProfilePage() {
  const me = useCurrentUser();
  const {signOut} = useAuth();
  const navigate = useNavigate();
  const {themeId, setTheme} = useTheme();
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const appearancePanelId = useId();
  const appearanceDescId = useId();
  const appearanceTitleId = useId();

  if (me.isLoading || !me.data) {
    return <ScreenSkeleton variant="profile" />;
  }

  const user = me.data;
  const primary = user.photos[0];
  const completion = user.completeness.percent;
  const verified = user.verification.phone && user.verification.photo;

  return (
    <div className="space-y-app-6 py-app-2">
      <header className="flex items-start justify-between gap-app-4">
        <h1 className="font-display text-[1.65rem] font-medium leading-tight tracking-tight text-unora-ink sm:text-[1.75rem]">
          {p.title}
        </h1>
        <div className="flex shrink-0 gap-app-1">
          <button
            type="button"
            aria-label={p.header.helpAria}
            className="tap-highlight-none rounded-2xl p-2.5 text-unora-ink/70 transition-colors hover:bg-unora-cloud/80 hover:text-unora-ink active:scale-[0.97]">
            <HelpIcon />
          </button>
          <button
            type="button"
            aria-label={p.header.settingsAria}
            className="tap-highlight-none rounded-2xl p-2.5 text-unora-ink/70 transition-colors hover:bg-unora-cloud/80 hover:text-unora-ink active:scale-[0.97]">
            <SettingsIcon />
          </button>
        </div>
      </header>

      <Card
        className={cn(
          "border-unora-line/90 p-app-4 shadow-soft sm:p-app-5",
          profileCreationSectionDividerClass
        )}>
        <div className="flex gap-app-4">
          <div className="relative shrink-0">
            <Avatar
              src={primary?.url}
              alt={primary?.alt ?? user.displayName}
              size="xl"
              fallback={user.displayName}
              className="h-[5.25rem] w-[5.25rem] rounded-full border-[3px] border-white object-cover shadow-soft ring-1 ring-unora-line/60"
            />
            <span className="absolute -bottom-1 left-1/2 flex min-w-[2.75rem] -translate-x-1/2 translate-y-1/4 items-center justify-center rounded-full bg-unora-ink px-2 py-0.5 text-[11px] font-semibold tabular-nums text-unora-snow shadow-soft ring-2 ring-white">
              {completion}%
            </span>
          </div>
          <div className="min-w-0 flex-1 space-y-app-3 pt-app-1">
            <div className="flex flex-wrap items-center gap-x-app-2 gap-y-app-1">
              <h2 className="font-display text-lg font-medium tracking-tight text-unora-ink sm:text-xl">
                {user.displayName}, {user.age}
              </h2>
              {verified ? <VerifiedBadge /> : null}
            </div>
            <Button
              type="button"
              variant="outlineInk"
              size="md"
              className="rounded-full px-app-5 shadow-soft"
              onClick={() => navigate(routes.profileEdit)}>
              {p.summary.completeProfile}
            </Button>
          </div>
        </div>
      </Card>

      <section
        className={cn("space-y-app-3", profileCreationSectionDividerClass)}>
        <div className="flex items-start justify-between gap-app-4">
          <div className="min-w-0 flex-1 space-y-app-1">
            <button
              type="button"
              aria-expanded={appearanceOpen}
              aria-controls={appearancePanelId}
              aria-describedby={appearanceDescId}
              onClick={() => setAppearanceOpen((v) => !v)}
              className={cn(
                "tap-highlight-none flex w-full items-center gap-app-2 rounded-xl py-0.5 text-left outline-none transition-colors text-[1.4rem] font-semibold",
                "hover:bg-unora-cloud/50 focus-visible:ring-2 focus-visible:ring-unora-brand-strong/35 focus-visible:ring-offset-2 focus-visible:ring-offset-unora-snow"
              )}>
              <Palette
                className="h-5 w-5 shrink-0 text-unora-brand-strong"
                strokeWidth={1.75}
                aria-hidden
              />
              <span
                id={appearanceTitleId}
                className="min-w-0 flex-1 font-display text-[1.4rem] font-semibold tracking-tight text-unora-ink">
                {p.appearance.title}
              </span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 shrink-0 text-unora-mist transition-transform duration-200 ease-out",
                  appearanceOpen && "rotate-180"
                )}
                strokeWidth={2}
                aria-hidden
              />
            </button>
            <p
              id={appearanceDescId}
              className="text-sm leading-relaxed text-unora-mist">
              {p.appearance.description}
            </p>
          </div>
        </div>

        {appearanceOpen ? (
          <div
            id={appearancePanelId}
            role="region"
            aria-labelledby={appearanceTitleId}
            className="grid grid-cols-2 gap-app-2 sm:gap-app-3">
            {THEME_IDS.map((id) => {
              const active = themeId === id;
              const tone = THEME_SELECT_APPEARANCE[id];
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTheme(id)}
                  className={cn(
                    "tap-highlight-none relative flex min-h-[5.25rem] w-full flex-col items-center justify-center rounded-2xl border border-unora-ink/10 px-app-3 py-app-4 text-center shadow-sm transition-all duration-200",
                    "hover:brightness-[0.97] active:scale-[0.99]"
                  )}
                  style={{
                    backgroundColor: `rgb(${tone.background})`,
                    boxShadow: active
                      ? `inset 0 0 0 2px rgb(${tone.selectionRing} / 0.38)`
                      : undefined,
                  }}>
                  {active ? (
                    <span
                      className="absolute right-2 top-2 text-[10px] font-semibold uppercase tracking-wide"
                      style={{color: `rgb(${tone.activeBadge})`}}>
                      {p.appearance.activeLabel}
                    </span>
                  ) : null}
                  <p
                    className="font-display text-sm font-semibold tracking-tight"
                    style={{color: `rgb(${tone.title})`}}>
                    {THEME_LABELS[id].title}
                  </p>
                </button>
              );
            })}
          </div>
        ) : null}
      </section>

      <Section
        className={profileCreationSectionDividerClass}
        titleIcon={CircleUser}
        title={p.account.title}
        description={p.account.description}>
        <Button
          type="button"
          variant="outlineInk"
          size="pill"
          className="shadow-soft"
          onClick={async () => {
            await signOut();
            globalThis.location.replace(routes.discover);
          }}>
          {p.account.signOut}
        </Button>
      </Section>
    </div>
  );
}
