import {useCallback, useEffect, useId, useRef, useState} from "react";

import {cn} from "@/lib/cn";

/** 0 = 0 km … 201 = 200+ km. Values above 201 from the API are shown as 201+ until edited. */
export const DISTANCE_SLIDER_MAX = 201;

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function sliderPosFromDistanceKm(km: number) {
  return Math.min(DISTANCE_SLIDER_MAX, Math.max(0, km));
}

type Props = {
  distanceKm: number;
  legend: string;
  className?: string;
  disabled?: boolean;
  /** `km` is the slider value in `0`…`DISTANCE_SLIDER_MAX` (201 = 200+). */
  onChange: (km: number) => void;
  valueLabel: (km: number) => string;
};

/**
 * Single-thumb distance control: 0…200 km plus a 200+ stop at 201, stored on the wire as
 * integer `distanceKm` (0–201). Legacy values &gt; 201 map to the rightmost stop for display.
 */
export function ProfileCreationDistanceSlider({
  className,
  disabled = false,
  distanceKm,
  onChange,
  legend,
  valueLabel,
}: Props) {
  const id = useId();
  const fieldsetId = `${id}-dist`;
  const trackRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState(false);

  const pos = sliderPosFromDistanceKm(distanceKm);
  const pThumb = (pos / DISTANCE_SLIDER_MAX) * 100;
  const labelText = valueLabel(pos);
  const displayKmForAria = pos;

  const setFromClientX = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el) {
        return;
      }
      const rect = el.getBoundingClientRect();
      const pad = 8;
      const w = Math.max(1, rect.width - 2 * pad);
      const t = (clientX - rect.left - pad) / w;
      const r = Math.max(0, Math.min(1, t));
      const next = clamp(
        Math.round(r * DISTANCE_SLIDER_MAX),
        0,
        DISTANCE_SLIDER_MAX
      );
      if (next !== pos) {
        onChange(next);
      }
    },
    [onChange, pos]
  );

  useEffect(() => {
    if (!drag) {
      return;
    }
    const move = (e: PointerEvent) => {
      if (e.buttons === 0) {
        return;
      }
      setFromClientX(e.clientX);
    };
    const up = () => {
      setDrag(false);
    };
    globalThis.addEventListener("pointermove", move);
    globalThis.addEventListener("pointerup", up);
    return () => {
      globalThis.removeEventListener("pointermove", move);
      globalThis.removeEventListener("pointerup", up);
    };
  }, [drag, setFromClientX]);

  const nudge = useCallback(
    (delta: number) => {
      const next = clamp(pos + delta, 0, DISTANCE_SLIDER_MAX);
      if (next !== pos) {
        onChange(next);
      }
    },
    [onChange, pos]
  );

  const thumbLeft = (pct: number) =>
    `calc(0.5rem + (${pct} / 100) * (100% - 1rem))` as const;

  return (
    <fieldset
      className={cn("min-w-0 select-none border-0 p-0", className)}
      data-disabled={disabled ? "" : undefined}
      id={fieldsetId}
      onPointerDown={(e) => {
        if (disabled) {
          e.preventDefault();
        }
      }}>
      <legend className="sr-only">{legend}</legend>
      <div className="relative mb-1 h-6 w-full">
        <span
          className="pointer-events-none absolute -translate-x-1/2 text-sm font-medium tabular-nums text-unora-ink"
          style={{left: thumbLeft(pThumb)}}>
          {labelText}
        </span>
      </div>
      <div
        className="relative w-full"
        onPointerDown={(e) => {
          if (disabled) {
            return;
          }
          if (
            (e.target as HTMLElement | null)?.closest?.("[data-range-thumb]")
          ) {
            return;
          }
          e.preventDefault();
          setFromClientX(e.clientX);
        }}
        ref={trackRef}
        style={{touchAction: "none"}}>
        <div className="absolute left-2 right-2 top-1/2 h-px -translate-y-1/2 bg-unora-line/80" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 bg-unora-ink"
          style={{
            left: "calc(0.5rem + 0%)",
            width: `calc((${pThumb} / 100) * (100% - 1rem))`,
          }}
        />
        <button
          className="absolute top-1/2 z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full bg-unora-ink shadow-sm active:cursor-grabbing disabled:cursor-not-allowed"
          data-range-thumb=""
          disabled={disabled}
          style={{left: thumbLeft(pThumb)}}
          type="button"
          aria-label={legend}
          aria-orientation="horizontal"
          role="slider"
          aria-valuemin={0}
          aria-valuemax={DISTANCE_SLIDER_MAX}
          aria-valuenow={displayKmForAria}
          aria-valuetext={
            displayKmForAria >= DISTANCE_SLIDER_MAX
              ? "200+ kilometers"
              : `${displayKmForAria} kilometers`
          }
          onKeyDown={(e) => {
            if (disabled) {
              return;
            }
            if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
              e.preventDefault();
              nudge(-1);
            } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
              e.preventDefault();
              nudge(1);
            } else if (e.key === "Home") {
              e.preventDefault();
              onChange(0);
            } else if (e.key === "End") {
              e.preventDefault();
              onChange(DISTANCE_SLIDER_MAX);
            }
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (disabled) {
              return;
            }
            (e.currentTarget as HTMLButtonElement).setPointerCapture(
              e.pointerId
            );
            setDrag(true);
            setFromClientX(e.clientX);
          }}
        />
      </div>
    </fieldset>
  );
}
