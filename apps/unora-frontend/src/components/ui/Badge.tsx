import type {HTMLAttributes} from "react";

import {cn} from "@/lib/cn";

const tones = {
  neutral: "bg-unora-cloud text-unora-ink border-unora-line",
  accent: "bg-unora-blush text-unora-ink border-unora-rose/30",
  success: "bg-unora-sage-muted text-unora-ink border-unora-sage/40",
  ink: "bg-unora-ink text-unora-snow border-unora-ink",
} as const;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: keyof typeof tones;
}

export function Badge({className, tone = "neutral", ...props}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
