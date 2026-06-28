import type {HTMLAttributes, ReactNode} from "react";

import {cn} from "@/lib/cn";

import {
  type StyledCapsuleCombo,
  styledCapsuleCombos,
} from "./styledCapsulePresets";

export interface StyledCapsuleProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  "children"
> {
  children: ReactNode;
  combo: StyledCapsuleCombo;
}

export function StyledCapsule({
  combo,
  children,
  className,
  ...rest
}: StyledCapsuleProps) {
  const c = styledCapsuleCombos[combo];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-app-2.5 py-1 text-[11px] font-semibold pl-1 pr-1",
        c.bg,
        c.text,
        c.ring,
        c.extras,
        className
      )}
      {...rest}>
      {children}
    </span>
  );
}
