import {useCallback, useEffect, useId, useRef, useState} from "react";

import {cn} from "@/lib/cn";

const MIN_AGE = 18;
const MAX_AGE = 99;

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

type Props = {
  ageMax: number;
  ageMin: number;
  /** Shown only to assistive tech (fieldset legend). */
  legend: string;
  className?: string;
  disabled?: boolean;
  onChange: (next: {ageMax: number; ageMin: number}) => void;
};

/**
 * Hinge-style dual thumb for age {min, max} on [18, 99] with a thick selected segment.
 */
export function ProfileCreationAgeRangeSlider({
  ageMin,
  ageMax,
  onChange,
  className,
  disabled = false,
  legend,
}: Props) {
  const id = useId();
  const groupId = `${id}-age-range`;
  const trackRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<"max" | "min" | null>(null);

  const ratio = (a: number) => (a - MIN_AGE) / (MAX_AGE - MIN_AGE);
  const pMin = ratio(ageMin) * 100;
  const pMax = ratio(ageMax) * 100;

  /** Nudge ratio [0,1] from a client X, using the same inset as the thumbs (0.5rem). */
  const ageFromClientX = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) {
      return MIN_AGE;
    }
    const rect = el.getBoundingClientRect();
    const pad = 8;
    const w = Math.max(1, rect.width - 2 * pad);
    const t = (clientX - rect.left - pad) / w;
    return Math.round(
      MIN_AGE + Math.max(0, Math.min(1, t)) * (MAX_AGE - MIN_AGE)
    );
  }, []);

  const setFromClientX = useCallback(
    (clientX: number, which: "max" | "min") => {
      const age = ageFromClientX(clientX);
      if (which === "min") {
        const next = clamp(age, MIN_AGE, ageMax - 1);
        if (next !== ageMin) {
          onChange({ageMin: next, ageMax});
        }
        return;
      }
      const next = clamp(age, ageMin + 1, MAX_AGE);
      if (next !== ageMax) {
        onChange({ageMin, ageMax: next});
      }
    },
    [ageFromClientX, ageMax, ageMin, onChange]
  );

  const pickThumbForTrack = useCallback(
    (clientX: number): "max" | "min" => {
      const age = ageFromClientX(clientX);
      if (Math.abs(age - ageMin) <= Math.abs(age - ageMax)) {
        return "min";
      }
      return "max";
    },
    [ageFromClientX, ageMax, ageMin]
  );

  useEffect(() => {
    if (drag == null) {
      return;
    }
    const move = (e: PointerEvent) => {
      if (e.buttons === 0) {
        return;
      }
      setFromClientX(e.clientX, drag);
    };
    const up = () => {
      setDrag(null);
    };
    globalThis.addEventListener("pointermove", move);
    globalThis.addEventListener("pointerup", up);
    return () => {
      globalThis.removeEventListener("pointermove", move);
      globalThis.removeEventListener("pointerup", up);
    };
  }, [drag, setFromClientX]);

  const nudge = useCallback(
    (which: "max" | "min", delta: number) => {
      if (which === "min") {
        const next = clamp(ageMin + delta, MIN_AGE, ageMax - 1);
        if (next !== ageMin) {
          onChange({ageMin: next, ageMax});
        }
        return;
      }
      const next = clamp(ageMax + delta, ageMin + 1, MAX_AGE);
      if (next !== ageMax) {
        onChange({ageMin, ageMax: next});
      }
    },
    [ageMax, ageMin, onChange]
  );

  const thumbLeft = (pct: number) =>
    `calc(0.5rem + (${pct} / 100) * (100% - 1rem))` as const;

  return (
    <fieldset
      className={cn("min-w-0 select-none border-0 p-0", className)}
      data-disabled={disabled ? "" : undefined}
      id={groupId}
      onPointerDown={(e) => {
        if (disabled) {
          e.preventDefault();
        }
      }}>
      <legend className="sr-only">{legend}</legend>
      <div className="relative mb-1 h-6 w-full">
        <span
          className="pointer-events-none absolute -translate-x-1/2 text-sm font-medium tabular-nums text-unora-ink"
          style={{left: thumbLeft(pMin)}}>
          {ageMin}
        </span>
        <span
          className="pointer-events-none absolute -translate-x-1/2 text-sm font-medium tabular-nums text-unora-ink"
          style={{left: thumbLeft(pMax)}}>
          {ageMax}
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
          const w = pickThumbForTrack(e.clientX);
          setFromClientX(e.clientX, w);
        }}
        ref={trackRef}
        style={{touchAction: "none"}}>
        <div className="absolute left-2 right-2 top-1/2 h-px -translate-y-1/2 bg-unora-line/80" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 bg-unora-ink"
          style={{
            left: thumbLeft(pMin),
            width: `calc((${pMax} - ${pMin}) / 100 * (100% - 1rem))`,
          }}
        />
        <button
          className="absolute top-1/2 z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full bg-unora-ink shadow-sm active:cursor-grabbing disabled:cursor-not-allowed"
          data-range-thumb=""
          disabled={disabled}
          style={{left: thumbLeft(pMin)}}
          type="button"
          aria-label="Minimum age"
          aria-orientation="horizontal"
          role="slider"
          aria-valuemax={ageMax - 1}
          aria-valuemin={MIN_AGE}
          aria-valuenow={ageMin}
          aria-valuetext={`${ageMin} years`}
          onKeyDown={(e) => {
            if (disabled) {
              return;
            }
            if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
              e.preventDefault();
              nudge("min", -1);
            } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
              e.preventDefault();
              nudge("min", 1);
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
            setDrag("min");
          }}
        />
        <button
          className="absolute top-1/2 z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full bg-unora-ink shadow-sm active:cursor-grabbing disabled:cursor-not-allowed"
          data-range-thumb=""
          disabled={disabled}
          style={{left: thumbLeft(pMax)}}
          type="button"
          aria-label="Maximum age"
          aria-orientation="horizontal"
          role="slider"
          aria-valuemax={MAX_AGE}
          aria-valuemin={ageMin + 1}
          aria-valuenow={ageMax}
          aria-valuetext={`${ageMax} years`}
          onKeyDown={(e) => {
            if (disabled) {
              return;
            }
            if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
              e.preventDefault();
              nudge("max", -1);
            } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
              e.preventDefault();
              nudge("max", 1);
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
            setDrag("max");
          }}
        />
      </div>
    </fieldset>
  );
}
