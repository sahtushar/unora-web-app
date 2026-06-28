import type {ReactNode} from "react";

import type {LucideIcon} from "lucide-react";

import {cn} from "@/lib/cn";

/** Separates stacked sections (border + rhythm) — use after the first content block in the sheet. */
export const detailedProfileSectionDividerClass =
  "mt-app-6 border-t-2 border-unora-line/60 pt-app-6";

export function DetailedProfileChip({children}: {children: ReactNode}) {
  return (
    <span className="inline-flex items-center rounded-full bg-unora-cloud px-app-3 py-1.5 text-sm font-medium text-unora-ink ring-1 ring-unora-line/50">
      {children}
    </span>
  );
}

export function DetailedProfileSectionHeading({
  icon: Icon,
  children,
}: {
  children: ReactNode;
  icon: LucideIcon;
}) {
  return (
    <div className="flex items-center gap-app-2">
      <Icon
        className="h-6 w-6 shrink-0 text-unora-brand-strong"
        strokeWidth={1.75}
        aria-hidden
      />
      <h2 className="min-w-0 flex-1 font-display text-2xl font-bold tracking-tight text-unora-ink">
        {children}
      </h2>
    </div>
  );
}

export function DetailedProfileSection({
  id,
  className,
  children,
}: {
  children: ReactNode;
  id: string;
  className?: string;
}) {
  return (
    <section id={id} className={cn(className)}>
      {children}
    </section>
  );
}
