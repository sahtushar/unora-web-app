import {type ImgHTMLAttributes, memo} from "react";

import {cn} from "@/lib/cn";

export interface AvatarProps extends Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src"
> {
  alt: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
  src?: string | null;
}

const sizeClass: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "h-9 w-9 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-20 w-20 text-lg",
};

export const Avatar = memo(function Avatar({
  src,
  alt,
  size = "md",
  fallback,
  className,
  loading = "lazy",
  decoding = "async",
  ...props
}: AvatarProps) {
  const initials = (fallback ?? alt).slice(0, 2).toUpperCase();

  if (src == null) {
    return (
      <div
        className={cn(
          "flex select-none items-center justify-center rounded-2xl bg-unora-cloud font-medium text-unora-mist",
          sizeClass[size],
          className
        )}
        aria-hidden>
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding={decoding}
      className={cn("rounded-2xl object-cover", sizeClass[size], className)}
      {...props}
    />
  );
});
