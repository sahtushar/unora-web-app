import type {HTMLAttributes} from "react";

import {UnoraMarkIcon} from "@/components/icons/UnoraMarkIcon";
import {strings} from "@/features/strings";
import {cn} from "@/lib/cn";

const b = strings.brand.shell;

const headerSubline = strings.brand.taglines[17];

export function AppBrandHeader({
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <header
      aria-label={b.ariaLabel}
      className={cn(
        "shrink-0 border-b border-unora-line/50 bg-gradient-to-b from-unora-canvas-from/45 via-unora-snow/0 to-unora-canvas-to/35",
        className
      )}
      {...props}>
      <div className="flex w-full items-center justify-between gap-app-2 px-app-2 py-app-2 sm:gap-app-3">
        <div className="flex shrink-0 items-center gap-app-2">
          <UnoraMarkIcon
            variant="theme"
            className="h-[20px] w-[20px] shrink-0 opacity-75"
            aria-hidden
          />
          <span className="font-display text-[11px] font-semibold uppercase tracking-[0.26em] text-unora-accent/55">
            {b.wordmark}
          </span>
        </div>
        <div className="flex min-w-0 flex-1 justify-end pl-app-2">
          <p className="max-w-[18rem] text-right font-sans text-[10.5px] font-medium leading-snug tracking-tight text-unora-brand-strong/85 sm:max-w-[22rem] sm:text-xs">
            {headerSubline}
          </p>
        </div>
      </div>
    </header>
  );
}
