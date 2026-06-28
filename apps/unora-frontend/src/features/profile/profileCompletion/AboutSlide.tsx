import {useMemo} from "react";

import {MessageSquareQuote} from "lucide-react";

import {cn} from "@/lib/cn";

import {strings} from "../../strings";
import {
  ABOUT_MAX_LENGTH,
  ABOUT_MIN_LENGTH,
  type CompletionDraft,
} from "./types";

const c = strings.profile.profileCompletionFlow.slides.about;

export function AboutSlide({
  draft,
  onPatch,
}: {
  draft: CompletionDraft;
  onPatch: (partial: Partial<CompletionDraft>) => void;
}) {
  const chars = draft.bio.trim().length;
  const remaining = Math.max(0, ABOUT_MAX_LENGTH - draft.bio.length);
  const suggestions = useMemo(() => {
    const pool = [...c.suggestions];
    for (let i = pool.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const a = pool[i] ?? "";
      const b = pool[j] ?? "";
      pool[i] = b;
      pool[j] = a;
    }
    return pool.slice(0, 4);
  }, []);

  return (
    <div className="space-y-app-4">
      <div className="rounded-3xl border border-unora-line/70 bg-white px-app-4 py-app-4 shadow-soft">
        <label className="block" htmlFor="profile-completion-bio">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-unora-mist">
            <MessageSquareQuote className="h-3.5 w-3.5" />
            {c.fieldLabel}
          </span>
          <textarea
            id="profile-completion-bio"
            value={draft.bio}
            onChange={(event) => onPatch({bio: event.target.value})}
            placeholder={c.placeholder}
            maxLength={ABOUT_MAX_LENGTH}
            rows={6}
            className="mt-app-2 w-full resize-none rounded-2xl border border-unora-line/80 bg-unora-snow/35 px-app-3 py-app-3 text-base leading-relaxed text-unora-ink outline-none transition focus:border-unora-brand-strong"
          />
        </label>
        <div className="mt-app-3 space-y-app-3 rounded-2xl border border-unora-line/70 bg-gradient-to-b from-white to-unora-cloud/35 p-app-3">
          <p className="text-xs  tracking-tight text-unora-ink">
            {c.suggestionsTitle}
          </p>
          <div className="flex flex-col gap-2">
            {suggestions.map((line) => {
              const selected = draft.bio.trim() === line.trim();
              return (
                <button
                  key={line}
                  type="button"
                  onClick={() => onPatch({bio: line})}
                  className={cn(
                    "tap-highlight-none rounded-2xl border px-app-3 py-app-3 text-left text-sm font-bold leading-tight text-unora-ink transition-all active:scale-[0.99]",
                    selected
                      ? "border-unora-brand-strong/50 bg-unora-blush/70 shadow-soft ring-1 ring-unora-brand/20"
                      : "border-unora-line/80 bg-white/90 hover:border-unora-brand/30 hover:bg-unora-cloud/45 hover:shadow-soft"
                  )}>
                  {line}
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-app-2 flex items-center justify-between gap-app-2 text-xs text-unora-mist">
          <p>{c.minHint.replace("{count}", String(ABOUT_MIN_LENGTH))}</p>
          <p>{c.remainingHint.replace("{count}", String(remaining))}</p>
        </div>
      </div>

      {chars >= ABOUT_MIN_LENGTH ? null : (
        <p className="text-xs text-unora-mist">
          {c.continueDisabledHint.replace("{count}", String(ABOUT_MIN_LENGTH))}
        </p>
      )}
    </div>
  );
}
