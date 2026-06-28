import type {ReactNode} from "react";

import {ArrowDownUp, type LucideIcon} from "lucide-react";

import {cn} from "@/lib/cn";

export interface InterestedMatchesHeaderProps {
  sortAriaLabel: string;
  title: string;
  sortActive?: boolean;
  sortDisabled?: boolean;
  subtitle?: string;
  /** Optional icon beside the subtitle line. */
  subtitleIcon?: LucideIcon;
  /** Optional icon beside the page title (e.g. Heart for Matches). */
  titleIcon?: LucideIcon;
  trailing?: ReactNode;
  onSortClick?: () => void;
}

export function InterestedMatchesHeader({
  title,
  titleIcon: TitleIcon,
  subtitle,
  subtitleIcon: SubtitleIcon,
  sortAriaLabel,
  onSortClick,
  sortDisabled = false,
  sortActive = false,
  trailing,
}: InterestedMatchesHeaderProps) {
  return (
    <header className="space-y-app-2">
      <div className="flex flex-wrap items-start justify-between gap-x-app-3 gap-y-app-2">
        <h1 className="flex min-w-0 items-center gap-app-2 font-display text-[1.85rem] font-semibold leading-tight tracking-tight text-unora-ink sm:text-[2rem]">
          {TitleIcon ? (
            <TitleIcon
              className="h-7 w-7 shrink-0 text-unora-brand-strong sm:h-8 sm:w-8"
              strokeWidth={1.5}
              aria-hidden
            />
          ) : null}
          <span className="min-w-0">{title}</span>
        </h1>
        <div className="flex shrink-0 items-center gap-app-2">
          {trailing}
          <button
            type="button"
            onClick={onSortClick}
            disabled={sortDisabled}
            aria-label={sortAriaLabel}
            aria-pressed={sortActive}
            className={cn(
              "tap-highlight-none flex h-11 w-11 items-center justify-center rounded-xl border shadow-soft transition active:scale-[0.97]",
              sortActive
                ? "border-unora-brand-strong/50 bg-unora-blush/80 text-unora-brand-strong ring-1 ring-unora-brand/25"
                : "border-unora-line/90 bg-white/95 text-unora-brand-strong hover:border-unora-ink/12",
              "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-unora-line/90"
            )}>
            <ArrowDownUp className="h-5 w-5" strokeWidth={2} aria-hidden />
          </button>
        </div>
      </div>
      {subtitle !== undefined && subtitle !== "" ? (
        <p className="flex max-w-[26rem] items-start gap-app-2 text-sm leading-relaxed text-unora-mist">
          {SubtitleIcon ? (
            <SubtitleIcon
              className="mt-0.5 h-4 w-4 shrink-0 text-unora-brand-strong/75"
              strokeWidth={2}
              aria-hidden
            />
          ) : null}
          <span className="min-w-0">{subtitle}</span>
        </p>
      ) : null}
    </header>
  );
}
