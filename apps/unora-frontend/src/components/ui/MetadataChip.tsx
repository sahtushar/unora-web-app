import type {HTMLAttributes, ReactNode} from "react";

import {cn} from "@/lib/cn";

export type MetadataChipVariant = "surface" | "overlay";

export interface MetadataChipProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  "children"
> {
  /** Primary text — truncated when long. */
  label: ReactNode;
  /** Optional secondary text — displayed below the primary text. */
  chipLabel?: ReactNode;
  /** Optional leading icon, emoji, or marker. */
  icon?: ReactNode;
  variant?: MetadataChipVariant;
}

const variantClass: Record<MetadataChipVariant, string> = {
  surface:
    "max-w-full min-w-0 gap-1.5 rounded-full bg-unora-cloud px-app-3 py-1.5 text-sm font-medium text-unora-ink ring-1 ring-unora-line/50",
  overlay:
    "max-w-full min-w-0 gap-1.5 rounded-full bg-black/50 px-app-3 py-1.5 text-[12px] font-medium leading-tight text-white backdrop-blur-md",
};

const iconWrapClass: Record<MetadataChipVariant, string> = {
  surface: "shrink-0 text-base leading-none",
  overlay: "shrink-0 text-[15px] leading-none opacity-95",
};

export function MetadataChip({
  chipLabel,
  label,
  icon,
  variant = "surface",
  className,
  ...rest
}: MetadataChipProps) {
  const showChipLabel = chipLabel != null && chipLabel !== false;
  const showIcon = icon != null && icon !== false;

  return (
    <span
      className={cn(
        "inline-flex flex-col items-center",
        showChipLabel && "gap-app-1"
      )}>
      {showChipLabel ? (
        <div className="m-auto flex flex-col items-center">
          <p className="m-0 text-xs font-medium text-unora-mist">{chipLabel}</p>
        </div>
      ) : null}
      <span
        className={cn(
          "inline-flex items-center",
          variantClass[variant],
          className
        )}
        {...rest}>
        {showIcon ? (
          <span className={iconWrapClass[variant]} aria-hidden={true}>
            {icon}
          </span>
        ) : null}
        <span className="min-w-0 truncate">{label}</span>
      </span>
    </span>
  );
}
