import {useId} from "react";
import type {ImgHTMLAttributes, SVGAttributes} from "react";

import {cn} from "@/lib/cn";

import markSrc from "./icon.svg";

type AssetProps = {
  variant?: "asset" | undefined;
} & ImgHTMLAttributes<HTMLImageElement>;

type ThemeProps = {
  variant: "theme";
  /** Accessible name; rendered as `<title>` when set. */
  title?: string;
} & Omit<SVGAttributes<SVGSVGElement>, "viewBox" | "fill" | "xmlns" | "title">;

export type UnoraMarkIconProps = AssetProps | ThemeProps;

/**
 * Unora mark from `icon.svg`.
 * - **`asset`** (default): bundled raster-style asset via `<img>`.
 * - **`theme`**: same geometry as `icon.svg` as inline SVG using `rgb(var(--u-*))` tokens so `className` text colors and presets apply.
 */
export function UnoraMarkIcon(props: UnoraMarkIconProps) {
  const markUid = useId().replaceAll(":", "");

  if (props.variant === "theme") {
    const {
      variant,
      className,
      title,
      "aria-hidden": ariaHidden,
      ...svgProps
    } = props;
    void variant;
    const glowId = `unora-mark-glow-${markUid}`;
    const gradId = `unora-mark-grad-${markUid}`;

    return (
      <svg
        viewBox="0 0 128 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        aria-hidden={ariaHidden}
        aria-label={title !== undefined && title !== "" ? title : undefined}
        role="img"
        {...svgProps}>
        {title !== undefined && title !== "" ? <title>{title}</title> : null}
        <defs>
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient
            id={gradId}
            x1="40"
            y1="40"
            x2="88"
            y2="40"
            gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgb(var(--u-brand) / 1)" />
            <stop offset="100%" stopColor="rgb(var(--u-brand-strong) / 1)" />
          </linearGradient>
        </defs>

        <circle cx="30" cy="80" r="4" fill="rgb(var(--u-mist) / 0.35)" />
        <circle cx="98" cy="80" r="4" fill="rgb(var(--u-mist) / 0.35)" />
        <circle cx="64" cy="110" r="4" fill="rgb(var(--u-mist) / 0.35)" />

        <path
          d="M40 45V75C40 88.2548 50.7452 99 64 99C77.2548 99 88 88.2548 88 75V45"
          stroke={`url(#${gradId})`}
          strokeWidth="6"
          strokeLinecap="round"
          filter={`url(#${glowId})`}
        />

        <circle
          cx="40"
          cy="40"
          r="8"
          fill="rgb(var(--u-brand) / 1)"
          filter={`url(#${glowId})`}
        />
        <circle
          cx="88"
          cy="40"
          r="8"
          fill="rgb(var(--u-brand-strong) / 1)"
          filter={`url(#${glowId})`}
        />

        <circle cx="40" cy="40" r="3" fill="rgb(var(--u-snow) / 0.85)" />
        <circle cx="88" cy="40" r="3" fill="rgb(var(--u-snow) / 0.85)" />
      </svg>
    );
  }

  const {
    className,
    title,
    alt,
    "aria-hidden": ariaHidden,
    ...imgProps
  } = props as AssetProps;
  const decorative = ariaHidden === true || ariaHidden === "true";
  const resolvedAlt =
    alt !== undefined && alt !== null && alt !== ""
      ? alt
      : decorative
        ? ""
        : (title ?? "Unora");

  return (
    <img
      src={markSrc}
      alt={resolvedAlt}
      title={title}
      decoding="async"
      className={cn("shrink-0 object-contain", className)}
      aria-hidden={ariaHidden}
      {...imgProps}
    />
  );
}
