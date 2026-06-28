import {type ImgHTMLAttributes, memo, useState} from "react";

import {cn} from "@/lib/cn";

import {Skeleton} from "./Skeleton";

export interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  blurDataUrl?: string;
}

/**
 * Lazy-friendly image with optional LQIP blur — swap src when CDN provides WebP/AVIF.
 */
export const LazyImage = memo(function LazyImage({
  className,
  blurDataUrl,
  alt,
  onLoad,
  onError,
  ...props
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {!loaded && (
        <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
      )}
      {blurDataUrl && !loaded && (
        <img
          src={blurDataUrl}
          alt=""
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-lg"
          aria-hidden
        />
      )}
      <img
        alt={alt}
        loading="lazy"
        decoding="async"
        className={cn(
          "h-full w-full object-cover transition-opacity duration-500 ease-out",
          loaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        onError={(e) => {
          setLoaded(true);
          onError?.(e);
        }}
        {...props}
      />
    </div>
  );
});
