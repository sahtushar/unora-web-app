import {Quote} from "lucide-react";

import {cn} from "@/lib/cn";

import {
  DetailedProfileSection,
  detailedProfileSectionDividerClass,
} from "./DetailedProfileShared";

export function DetailedProfileEmphasisCard({
  id,
  showTopDivider = false,
  title,
  kicker,
  body,
  commentCta,
  commentAriaLabel,
  showCommentCta = false,
}: {
  body: string;
  commentAriaLabel: string;
  commentCta: string;
  id: string;
  title: string;
  kicker?: string;
  showCommentCta?: boolean;
  showTopDivider?: boolean;
}) {
  return (
    <DetailedProfileSection
      id={id}
      className={
        showTopDivider ? detailedProfileSectionDividerClass : undefined
      }>
      <div
        className={cn(
          "overflow-hidden rounded-2xl border border-unora-line/55 bg-white p-app-6 shadow-card sm:rounded-3xl sm:p-app-8"
        )}>
        <h2 className="font-display text-2xl font-bold tracking-tight text-unora-ink">
          {title}
        </h2>
        {kicker ? (
          <p className="mt-app-2 font-sans text-sm font-semibold leading-snug text-unora-mist">
            {kicker}
          </p>
        ) : null}
        <p
          className={cn(
            "font-sans text-2xl font-extrabold leading-[1.25] tracking-tight text-unora-ink sm:text-[1.6875rem]",
            kicker ? "mt-app-2" : "mt-app-3"
          )}>
          {body}
        </p>
        {showCommentCta ? (
          <div className="mt-app-8 flex justify-end sm:mt-app-10">
            <button
              type="button"
              aria-label={commentAriaLabel}
              className="tap-highlight-none inline-flex items-center gap-app-2 rounded-full bg-unora-ink px-app-5 py-app-3 text-sm font-semibold text-unora-snow shadow-soft ring-1 ring-unora-ink/20 transition hover:bg-unora-ink/90 active:scale-[0.98]">
              {commentCta}
              <Quote
                className="h-4 w-4 shrink-0 opacity-95"
                strokeWidth={2.25}
                aria-hidden
              />
            </button>
          </div>
        ) : null}
      </div>
    </DetailedProfileSection>
  );
}
