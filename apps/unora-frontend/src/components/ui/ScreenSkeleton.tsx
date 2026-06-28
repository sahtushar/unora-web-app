import {cn} from "@/lib/cn";

import {Skeleton} from "./Skeleton";

export type ScreenSkeletonVariant =
  | "discover"
  | "connection"
  | "list"
  | "profile";

export interface ScreenSkeletonProps {
  variant: ScreenSkeletonVariant;
  className?: string;
}

/**
 * Route-level skeletons shaped like real screens — pairs with jittered mock API delays.
 */
export function ScreenSkeleton({variant, className}: ScreenSkeletonProps) {
  return (
    <div
      className={cn("space-y-app-5 py-app-2", className)}
      aria-busy
      aria-label="Loading">
      <div className="space-y-app-2">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-4 w-full max-w-[14rem]" />
      </div>

      {variant === "discover" && (
        <>
          <Skeleton className="h-[min(58dvh,26rem)] w-full rounded-2xl shadow-soft" />
          <div className="flex gap-app-3">
            <Skeleton className="h-12 flex-1 rounded-2xl" />
            <Skeleton className="h-12 flex-1 rounded-2xl" />
          </div>
        </>
      )}

      {variant === "connection" && (
        <>
          <Skeleton className="h-20 w-full rounded-2xl shadow-soft" />
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="min-h-[240px] flex-1 rounded-2xl shadow-soft" />
        </>
      )}

      {variant === "list" && (
        <div className="space-y-app-3">
          <Skeleton className="h-24 w-full rounded-2xl shadow-soft" />
          <Skeleton className="h-24 w-full rounded-2xl shadow-soft" />
          <Skeleton className="h-24 w-full rounded-2xl shadow-soft" />
        </div>
      )}

      {variant === "profile" && (
        <>
          <Skeleton className="h-28 w-full rounded-2xl shadow-soft" />
          <div className="grid grid-cols-3 gap-app-2">
            <Skeleton className="aspect-square rounded-2xl" />
            <Skeleton className="aspect-square rounded-2xl" />
            <Skeleton className="aspect-square rounded-2xl" />
          </div>
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </>
      )}
    </div>
  );
}
