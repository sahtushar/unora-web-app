import type {ReactNode} from "react";

import {cn} from "@/lib/cn";

export interface PageHeaderProps {
  title: string;
  className?: string;
  subtitle?: string;
  trailing?: ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  trailing,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn("flex items-start justify-between gap-app-4", className)}>
      <div className="min-w-0">
        <h1 className="font-display text-[1.65rem] font-medium leading-tight tracking-tight text-unora-ink sm:text-[1.75rem]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-app-2 max-w-[20rem] text-sm leading-relaxed text-unora-mist">
            {subtitle}
          </p>
        )}
      </div>
      {trailing}
    </header>
  );
}
