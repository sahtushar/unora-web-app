import {cn} from "@/lib/cn";

type SoftSectionLoaderProps = {
  className?: string;
};

/**
 * Subtle indeterminate line for the top of a block (e.g. `Section` while a mutation is in flight).
 * Reuses the same soft shimmer as `Skeleton`, tuned for a thin bar.
 */
export function SoftSectionLoader({className}: SoftSectionLoaderProps) {
  return (
    <div className={cn("pointer-events-none w-full", className)} aria-hidden>
      <div className="h-0.5 w-full overflow-hidden rounded-full">
        <div className="h-0.5 w-full rounded-full bg-gradient-to-r from-unora-line/0 via-unora-brand/30 to-unora-line/0 bg-[length:200%_100%] motion-reduce:opacity-50 motion-reduce:animate-none animate-shimmer" />
      </div>
    </div>
  );
}
