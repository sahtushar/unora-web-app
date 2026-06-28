import type {HTMLAttributes} from "react";

import {cn} from "@/lib/cn";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
}

export function Card({className, padded = true, ...props}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-unora-line/70 bg-white/95 shadow-soft backdrop-blur-sm transition-shadow duration-300 ease-out",
        padded && "p-app-4 sm:p-app-5",
        className
      )}
      {...props}
    />
  );
}
