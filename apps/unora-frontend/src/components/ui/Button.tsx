import {type ButtonHTMLAttributes, forwardRef} from "react";

import {cn} from "@/lib/cn";

const variants = {
  primary:
    "bg-unora-ink text-unora-snow shadow-soft border border-unora-ink/80 hover:bg-unora-ink/92 hover:shadow-lift hover:border-unora-ink active:scale-[0.98] active:shadow-soft",
  secondary:
    "bg-white/90 text-unora-ink border border-unora-line/90 shadow-soft hover:border-unora-ink/15 hover:bg-unora-cloud/50 hover:shadow-card active:scale-[0.98]",
  ghost:
    "bg-transparent text-unora-ink hover:bg-unora-cloud/70 active:scale-[0.98] border border-transparent hover:border-unora-line/60",
  danger:
    "bg-red-900/92 text-white border border-red-950/30 shadow-soft hover:bg-red-900 hover:shadow-lift active:scale-[0.98]",
  /** OAuth-style pill (e.g. Google) */
  google:
    "bg-gradient-to-b from-white to-unora-cloud/30 text-unora-ink border border-unora-line/75 shadow-lift ring-1 ring-unora-ink/[0.04] hover:border-unora-ink/18 hover:from-white hover:to-white hover:shadow-card hover:ring-unora-brand-strong/12 active:scale-[0.98]",
  /** High-contrast outline for secondary sign-in paths */
  outlineInk:
    "bg-white text-unora-ink border-[1.5px] border-unora-ink shadow-none hover:bg-unora-cloud/35 hover:shadow-soft active:scale-[0.98]",
} as const;

const sizes = {
  sm: "h-9 px-app-3 text-sm rounded-xl",
  md: "h-11 px-app-4 text-sm rounded-2xl",
  lg: "h-12 px-app-5 text-[15px] rounded-2xl",
  /** Full-width sign-in CTAs */
  pill: "h-14 w-full rounded-full px-app-6 text-[15px] font-semibold",
  icon: "h-11 w-11 rounded-2xl",
} as const;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: keyof typeof sizes;
  variant?: keyof typeof variants;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {className, variant = "primary", size = "md", type = "button", ...props},
    ref
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "tap-highlight-none touch-manipulation inline-flex items-center justify-center font-medium tracking-tight",
          "transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-40",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
