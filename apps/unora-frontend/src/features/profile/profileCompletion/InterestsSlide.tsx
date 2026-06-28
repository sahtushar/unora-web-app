import {useMemo, useState} from "react";

import {Heart, Plus, X} from "lucide-react";

import {cn} from "@/lib/cn";

import {strings} from "../../strings";
import {
  INTEREST_CATALOG,
  PROFILE_INTEREST_MAX_SELECTION,
  getCatalogInterest,
} from "../interestCatalog";
import {PROFILE_CREATION_MIN_INTERESTS} from "../profileCreationModel";
import type {CompletionDraft} from "./types";

const c = strings.profile.profileCompletionFlow.slides.interests;
const pc = strings.profile.profileCreation;
const interestLabels = pc.interestLabels;

export function InterestsSlide({
  draft,
  onToggleInterest,
}: {
  draft: CompletionDraft;
  onToggleInterest: (id: string) => void;
}) {
  const selected = useMemo(() => new Set(draft.interests), [draft.interests]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const count = selected.size;
  const remaining = Math.max(0, PROFILE_INTEREST_MAX_SELECTION - count);

  const statusLine =
    remaining === 0
      ? c.selectionFull
      : c.selectionRemaining
          .replace("{count}", String(remaining))
          .replace("{max}", String(PROFILE_INTEREST_MAX_SELECTION));

  return (
    <div className="space-y-app-4">
      <div className="rounded-3xl border border-unora-line/70 bg-white px-app-4 py-app-4 shadow-soft">
        <p className="text-sm text-unora-mist">{statusLine}</p>
        <p className="mt-app-1 text-xs text-unora-mist">{c.minHint}</p>

        <div className="mt-app-3 flex min-h-[2.75rem] flex-wrap gap-app-2">
          {draft.interests.length === 0 ? (
            <span className="text-sm text-unora-mist/90">
              {c.emptySelection}
            </span>
          ) : (
            draft.interests.map((id) => {
              const fromCatalog = getCatalogInterest(id);
              const label =
                fromCatalog?.label ??
                interestLabels[id as keyof typeof interestLabels] ??
                id;
              const icon = fromCatalog?.icon ?? "✦";
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onToggleInterest(id)}
                  className="tap-highlight-none inline-flex max-w-full items-center gap-1.5 rounded-full border border-unora-brand-strong/35 bg-unora-blush/65 px-app-3 py-1.5 text-xs font-medium text-unora-ink transition active:scale-[0.98]">
                  <span aria-hidden>{icon}</span>
                  <span className="min-w-0 truncate">{label}</span>
                  <X
                    className="h-3.5 w-3.5 shrink-0 text-unora-mist"
                    aria-hidden
                  />
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="space-y-app-5 rounded-3xl border border-unora-line/70 bg-white px-app-4 py-app-4 shadow-soft">
        {INTEREST_CATALOG.map((category) => {
          const isOpen = expanded[category.id] === true;
          const items = isOpen
            ? category.interests
            : category.interests.slice(0, category.defaultVisible);
          const hasToggle = category.interests.length > category.defaultVisible;

          return (
            <section key={category.id} className="space-y-app-2">
              <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-unora-ink">
                <Heart className="h-3.5 w-3.5 text-unora-brand-strong" />
                {category.title}
              </h3>

              <div className="flex flex-wrap gap-app-2">
                {items.map((item) => {
                  const on = selected.has(item.id);
                  const atCap = count >= PROFILE_INTEREST_MAX_SELECTION && !on;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      disabled={atCap}
                      onClick={() => onToggleInterest(item.id)}
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
                    setExpanded((prev) => ({...prev, [category.id]: !isOpen}))
                  }
                  className="tap-highlight-none text-xs font-medium text-unora-brand-strong underline-offset-4 hover:underline">
                  {isOpen ? c.showLess : c.showMore}
                </button>
              ) : null}
            </section>
          );
        })}
      </div>

      {count >= PROFILE_CREATION_MIN_INTERESTS ? null : (
        <p className="text-xs text-unora-mist">{c.continueDisabledHint}</p>
      )}
    </div>
  );
}
