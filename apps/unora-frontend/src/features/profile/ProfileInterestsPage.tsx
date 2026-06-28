import {useMemo, useState} from "react";

import {Plus, X} from "lucide-react";
import {createPortal} from "react-dom";
import {useNavigate, useOutletContext} from "react-router-dom";

import {Button} from "@/components/ui";
import {cn} from "@/lib/cn";
import {routes} from "@/lib/routes";

import {strings} from "../strings";
import {
  INTEREST_CATALOG,
  PROFILE_INTEREST_MAX_SELECTION,
  getCatalogInterest,
} from "./interestCatalog";
import {PROFILE_INTERESTS_SECTION_ID} from "./profileAnchors";
import {PROFILE_CREATION_MIN_INTERESTS} from "./profileCreationModel";
import type {ProfileEditOutletContext} from "./profileEditOutletContext";

const pc = strings.profile.profileCreation;
const ip = pc.interestPicker;
const interestLabels = pc.interestLabels;

export default function ProfileInterestsPage() {
  const {profile} = useOutletContext<ProfileEditOutletContext>();
  const {draft, toggleInterest} = profile;
  const navigate = useNavigate();
  const selected = useMemo(() => new Set(draft.interests), [draft.interests]);
  const count = selected.size;
  const remaining = Math.max(0, PROFILE_INTEREST_MAX_SELECTION - count);
  const canContinue = count >= PROFILE_CREATION_MIN_INTERESTS;

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const legacyIds = useMemo(
    () => draft.interests.filter((id) => !getCatalogInterest(id)),
    [draft.interests]
  );

  const statusLine = useMemo(() => {
    if (remaining === 0) {
      return ip.selectionFull;
    }
    return ip.selectionRemaining
      .replace("{count}", String(remaining))
      .replace("{max}", String(PROFILE_INTEREST_MAX_SELECTION));
  }, [remaining]);

  const goBackToInterestsSection = () => {
    navigate({
      pathname: routes.profileEdit,
      hash: PROFILE_INTERESTS_SECTION_ID,
    });
  };

  const footerDock =
    typeof globalThis.document !== "undefined"
      ? createPortal(
          <nav
            className={cn(
              "pointer-events-none fixed inset-x-0 bottom-0 z-[45] flex justify-center"
            )}
            aria-label={ip.footerDockAria}>
            <div className="pointer-events-auto w-full max-w-app px-app-4 pb-app-nav pt-app-2">
              <div
                className={cn(
                  "rounded-2xl border border-unora-line/85 bg-unora-snow/96 p-app-3",
                  "shadow-nav ring-1 ring-inset ring-unora-line/35",
                  "backdrop-blur-2xl backdrop-saturate-150"
                )}>
                <Button
                  type="button"
                  size="pill"
                  className="w-full"
                  disabled={!canContinue}
                  onClick={goBackToInterestsSection}>
                  {ip.continue}
                </Button>
                {canContinue ? null : (
                  <p className="mt-app-2 text-center text-xs text-unora-mist">
                    {ip.continueDisabledHint}
                  </p>
                )}
              </div>
            </div>
          </nav>,
          globalThis.document.body
        )
      : null;

  return (
    <>
      <div className="flex flex-col gap-app-4 pb-[calc(theme(spacing.app-nav)+8.5rem)]">
        <p className="text-sm leading-relaxed text-unora-mist">{statusLine}</p>

        {legacyIds.length > 0 ? (
          <section className="space-y-app-2 rounded-2xl border border-unora-line/90 bg-unora-cloud/40 p-app-3">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-unora-mist">
              {ip.legacySelectedTitle}
            </h2>
            <div className="flex flex-wrap gap-app-2">
              {legacyIds.map((id) => {
                const label =
                  interestLabels[id as keyof typeof interestLabels] ?? id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleInterest(id)}
                    className="tap-highlight-none inline-flex items-center gap-1.5 rounded-full border border-unora-line/90 bg-white/90 px-app-3 py-1.5 text-xs font-medium text-unora-ink transition active:scale-[0.98]">
                    <span className="min-w-0 truncate">{label}</span>
                    <X
                      className="h-3.5 w-3.5 shrink-0 text-unora-mist"
                      aria-hidden
                    />
                  </button>
                );
              })}
            </div>
          </section>
        ) : null}

        <div className="space-y-app-8">
          {INTEREST_CATALOG.map((category) => {
            const isOpen = expanded[category.id] === true;
            const items = isOpen
              ? category.interests
              : category.interests.slice(0, category.defaultVisible);
            const hasToggle =
              category.interests.length > category.defaultVisible;

            return (
              <section key={category.id} className="space-y-app-3">
                <h2 className="font-display text-base font-semibold tracking-tight text-unora-ink">
                  {category.title}
                </h2>
                <div className="flex flex-wrap gap-app-2">
                  {items.map((item) => {
                    const on = selected.has(item.id);
                    const atCap =
                      count >= PROFILE_INTEREST_MAX_SELECTION && !on;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        disabled={atCap}
                        onClick={() => toggleInterest(item.id)}
                        aria-pressed={on}
                        className={cn(
                          "tap-highlight-none inline-flex max-w-full min-w-0 items-center gap-2 rounded-2xl border px-app-3 py-2 text-left text-sm font-medium transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40",
                          on
                            ? "border-unora-brand-strong/45 bg-unora-blush/75 text-unora-ink shadow-soft ring-1 ring-unora-brand/20"
                            : "border-unora-line/90 bg-white/90 text-unora-ink/90 hover:border-unora-ink/15"
                        )}>
                        <span className="shrink-0 text-base" aria-hidden>
                          {item.icon}
                        </span>
                        <span className="min-w-0 flex-1 truncate">
                          {item.label}
                        </span>
                        <span className="shrink-0 text-unora-mist" aria-hidden>
                          {on ? (
                            <X className="h-4 w-4" strokeWidth={2.25} />
                          ) : (
                            <Plus className="h-4 w-4" strokeWidth={2.25} />
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {hasToggle ? (
                  <button
                    type="button"
                    onClick={() =>
                      setExpanded((m) => ({
                        ...m,
                        [category.id]: !isOpen,
                      }))
                    }
                    className="tap-highlight-none text-sm font-medium text-unora-brand-strong underline-offset-4 hover:underline">
                    {isOpen ? ip.showLess : ip.showMore}
                  </button>
                ) : null}
              </section>
            );
          })}
        </div>
      </div>
      {footerDock}
    </>
  );
}
