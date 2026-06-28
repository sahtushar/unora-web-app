import type {ReactNode} from "react";

import {cn} from "@/lib/cn";

export function InterestedListFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-center text-[11px] leading-relaxed text-unora-mist",
        className
      )}>
      {children}
    </p>
  );
}
