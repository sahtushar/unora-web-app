import type {ReactNode} from "react";

import type {LucideIcon} from "lucide-react";

import {cn} from "@/lib/cn";

export function ConnectionMainHeading({
  icon: Icon,
  subtitle,
  children,
  className,
}: {
  children: ReactNode;
  icon: LucideIcon;
  className?: string;
  subtitle?: string;
}) {
  return (
    <header className={cn("space-y-app-2", className)}>
      <div className="flex items-center gap-app-2">
        <Icon
          className="h-7 w-7 shrink-0 text-unora-brand-strong sm:h-8 sm:w-8"
          strokeWidth={1.5}
          aria-hidden
        />
        <h1 className="font-display text-[1.85rem] font-semibold leading-tight tracking-tight text-unora-ink sm:text-[2rem]">
          {children}
        </h1>
      </div>
      {subtitle !== undefined && subtitle !== "" ? (
        <p className="max-w-[22rem] text-sm leading-relaxed text-unora-mist">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
