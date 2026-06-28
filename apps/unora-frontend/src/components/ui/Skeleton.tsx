import {cn} from "@/lib/cn";

export function Skeleton({className}: {className?: string}) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-2xl bg-gradient-to-r from-unora-cloud via-unora-line/50 to-unora-cloud bg-[length:200%_100%]",
        className
      )}
      aria-hidden
    />
  );
}
