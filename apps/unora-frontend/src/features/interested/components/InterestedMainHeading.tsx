import type {ReactNode} from "react";

import type {LucideIcon} from "lucide-react";

import {cn} from "@/lib/cn";

export function InterestedMainHeading({
  children,
  className,
  icon: Icon,
  subtitle,
  trailing,
}: {
  children: ReactNode;
  icon: LucideIcon;
  className?: string;
  subtitle?: string;
  trailing?: ReactNode;
}) {
  return (
    <header className={cn("space-y-app-2", className)}>
      <div className="flex flex-wrap items-center justify-between gap-x-app-3 gap-y-app-2">
        <div className="flex min-w-0 items-center gap-app-2">
          <Icon
            className="h-7 w-7 shrink-0 text-unora-brand-strong sm:h-8 sm:w-8"
            strokeWidth={1.5}
            aria-hidden
          />
          <h1 className="font-display text-[1.85rem] font-semibold leading-tight tracking-tight text-unora-ink sm:text-[2rem]">
            {children}
          </h1>
        </div>
        {trailing != null ? <div className="shrink-0">{trailing}</div> : null}
      </div>
      {subtitle !== undefined && subtitle !== "" ? (
        <p className="max-w-[22rem] text-sm leading-relaxed text-unora-mist">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
