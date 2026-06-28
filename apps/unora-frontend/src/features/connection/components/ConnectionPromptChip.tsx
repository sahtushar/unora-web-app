import type {ButtonHTMLAttributes, ReactNode} from "react";

import {cn} from "@/lib/cn";

const chipClass =
  "rounded-full border border-unora-line/90 bg-white/95 px-app-4 py-2.5 text-left text-xs font-medium leading-snug text-unora-ink/90 shadow-soft " +
  "transition-all duration-200 hover:border-unora-brand-strong/25 hover:bg-unora-snow hover:shadow-card " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-unora-brand-strong/35 " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55";

export function ConnectionPromptChip({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {children: ReactNode}) {
  return (
    <button type="button" className={cn(chipClass, className)} {...props}>
      {children}
    </button>
  );
}
