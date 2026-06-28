import type {ReactNode} from "react";

import {cn} from "@/lib/cn";

export interface EmptyStateProps {
  description: string;
  title: string;
  actions?: ReactNode;
  className?: string;
  footnote?: string;
  icon?: ReactNode;
}

export function EmptyState({
  title,
  description,
  icon,
  actions,
  footnote,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-unora-line/80 bg-white/90 px-app-6 py-app-10 text-center shadow-card",
        "before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(120%_80%_at_50%_-20%,rgb(var(--u-brand)_/_0.18),transparent_55%)]",
        className
      )}>
      <div className="relative z-[1] flex max-w-sm flex-col items-center">
        {icon && (
          <div className="mb-app-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-unora-line/80 bg-unora-snow/90 text-unora-mist shadow-soft">
            {icon}
          </div>
        )}
        <h3 className="font-display text-[1.35rem] font-medium leading-snug tracking-tight text-unora-ink sm:text-xl">
          {title}
        </h3>
        <p className="mt-app-3 text-sm leading-relaxed text-unora-mist">
          {description}
        </p>
        {actions && (
          <div className="mt-app-6 flex w-full max-w-xs flex-col items-stretch gap-app-3 sm:flex-row sm:justify-center">
            {actions}
          </div>
        )}
        {footnote && (
          <p className="mt-app-5 text-[11px] leading-relaxed text-unora-mist/90">
            {footnote}
          </p>
        )}
      </div>
    </div>
  );
}
