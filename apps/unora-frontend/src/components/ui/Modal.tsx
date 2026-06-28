import {
  type ReactNode,
  type TransitionEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import {X} from "lucide-react";
import {createPortal} from "react-dom";

import {cn} from "@/lib/cn";

/** Preset for enter / leave transitions (dismiss uses the leave variant). */
export type ModalAnimationPreset = "fade-scale" | "fade" | "none";

export interface ModalProps {
  open: boolean;
  /** Primary heading (always shown). */
  title: ReactNode;
  /**
   * Enter / exit motion. `fade-scale` softens scale + fade + slight lift on dismiss;
   * `fade` is opacity only; `none` unmounts immediately when closed.
   */
  animation?: ModalAnimationPreset;
  /** Duration in ms for transition (enter + exit). Default 220. */
  animationDurationMs?: number;
  /** Accessible label for the full-screen dismiss control behind the panel. */
  backdropDismissAriaLabel?: string;
  children?: ReactNode;
  className?: string;
  /** Accessible label for the corner close control; set to `null` to hide the button. */
  closeAriaLabel?: string | null;
  /** Optional supporting line under the title. */
  description?: ReactNode;
  /** Sticky actions row (e.g. buttons). */
  footer?: ReactNode;
  onClose: () => void;
}

const timing = "cubic-bezier(0.22, 1, 0.36, 1)";

function transitionStyle(ms: number) {
  return {
    transitionDuration: `${ms}ms`,
    transitionTimingFunction: timing,
  } as const;
}

function useModalPresence(
  open: boolean,
  animation: ModalAnimationPreset,
  animationDurationMs: number
) {
  const [showPortal, setShowPortal] = useState(open);
  const [isClosing, setIsClosing] = useState(false);
  const [entered, setEntered] = useState(animation === "none");
  const exitCompleteRef = useRef(false);

  const duration = animation === "none" ? 0 : animationDurationMs;

  useEffect(() => {
    if (open) {
      setShowPortal(true);
      setIsClosing(false);
      exitCompleteRef.current = false;
      if (animation === "none") {
        setEntered(true);
        return undefined;
      }
      setEntered(false);
      const id = globalThis.requestAnimationFrame(() => {
        globalThis.requestAnimationFrame(() => {
          setEntered(true);
        });
      });
      return () => globalThis.cancelAnimationFrame(id);
    }
    if (!showPortal) {
      return undefined;
    }
    if (animation === "none") {
      setShowPortal(false);
      setEntered(false);
      return undefined;
    }
    exitCompleteRef.current = false;
    setIsClosing(true);
    return undefined;
  }, [open, showPortal, animation]);

  const completeExit = useCallback(() => {
    if (exitCompleteRef.current) {
      return;
    }
    exitCompleteRef.current = true;
    setIsClosing(false);
    setShowPortal(false);
    setEntered(false);
  }, []);

  const onPanelTransitionEnd = useCallback(
    (e: TransitionEvent<HTMLDivElement>) => {
      if (e.target !== e.currentTarget) {
        return;
      }
      if (!isClosing) {
        return;
      }
      if (e.propertyName !== "opacity") {
        return;
      }
      completeExit();
    },
    [isClosing, completeExit]
  );

  useEffect(() => {
    if (!isClosing || animation === "none" || duration <= 0) {
      return undefined;
    }
    const safety = globalThis.setTimeout(() => {
      completeExit();
    }, duration + 120);
    return () => globalThis.clearTimeout(safety);
  }, [isClosing, animation, duration, completeExit]);

  const backdropVisible = entered && !isClosing;
  const panelVisible = entered && !isClosing;

  return {
    showPortal,
    entered,
    isClosing,
    duration,
    backdropVisible,
    panelVisible,
    onPanelTransitionEnd,
  };
}

function modalBackdropClass(
  animation: ModalAnimationPreset,
  backdropVisible: boolean
) {
  if (animation === "none") {
    return "";
  }
  return cn(
    "transition-opacity",
    backdropVisible ? "opacity-100" : "opacity-0"
  );
}

function modalPanelMotionClass(
  animation: ModalAnimationPreset,
  panelVisible: boolean
) {
  if (animation === "none") {
    return "";
  }
  if (animation === "fade") {
    return cn("transition-opacity", panelVisible ? "opacity-100" : "opacity-0");
  }
  return cn(
    "transition-[opacity,transform]",
    panelVisible
      ? "translate-y-0 scale-100 opacity-100 sm:translate-y-0"
      : "translate-y-3 scale-[0.96] opacity-0 sm:translate-y-2 sm:scale-[0.97]"
  );
}

/**
 * Theme-aware overlay dialog (portal to `document.body`).
 * Dismiss: backdrop click, Escape, optional corner close button.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  backdropDismissAriaLabel = "Dismiss dialog",
  closeAriaLabel = "Close",
  className,
  animation = "fade-scale",
  animationDurationMs = 220,
}: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  const {
    showPortal,
    entered,
    isClosing,
    duration,
    backdropVisible,
    panelVisible,
    onPanelTransitionEnd,
  } = useModalPresence(open, animation, animationDurationMs);

  const tStyle = duration > 0 ? transitionStyle(duration) : undefined;

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!showPortal) {
      return;
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [showPortal, onKeyDown]);

  useEffect(() => {
    if (!open || !showPortal || isClosing || !entered) {
      return;
    }
    const t = globalThis.setTimeout(() => {
      panelRef.current?.focus();
    }, 0);
    return () => globalThis.clearTimeout(t);
  }, [open, showPortal, isClosing, entered]);

  if (!showPortal || globalThis.document === undefined) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[60] flex min-h-0 items-center justify-center overflow-y-auto p-app-4 py-app-6">
      <button
        type="button"
        style={tStyle}
        className={cn(
          "absolute inset-0 bg-unora-ink/40 backdrop-blur-[2px]",
          modalBackdropClass(animation, backdropVisible)
        )}
        aria-label={backdropDismissAriaLabel}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={
          description !== undefined && description !== null
            ? descriptionId
            : undefined
        }
        tabIndex={-1}
        style={tStyle}
        onTransitionEnd={onPanelTransitionEnd}
        className={cn(
          "relative z-10 my-auto max-h-[min(90dvh,40rem)] w-full max-w-md shrink-0 overflow-y-auto outline-none",
          "rounded-3xl border border-unora-line/90 bg-unora-snow shadow-phone ring-1 ring-inset ring-unora-line/30",
          "p-app-4 sm:p-app-5",
          modalPanelMotionClass(animation, panelVisible),
          className
        )}>
        <div className="flex items-start justify-between gap-app-3">
          <h2
            id={titleId}
            className="min-w-0 flex-1 font-display text-xl font-semibold leading-snug tracking-tight text-unora-ink sm:text-[1.35rem]">
            {title}
          </h2>
          {closeAriaLabel === null ? null : (
            <button
              type="button"
              onClick={onClose}
              aria-label={closeAriaLabel}
              className="tap-highlight-none -m-app-1 shrink-0 rounded-xl p-app-2 text-unora-mist transition hover:bg-unora-cloud/80 hover:text-unora-ink">
              <X className="h-5 w-5" strokeWidth={2} aria-hidden />
            </button>
          )}
        </div>
        {description !== undefined && description !== null ? (
          <div
            id={descriptionId}
            className="mt-app-3 text-sm leading-relaxed text-unora-mist">
            {description}
          </div>
        ) : null}
        {children !== undefined && children !== null ? (
          <div className="mt-app-4">{children}</div>
        ) : null}
        {footer !== undefined && footer !== null ? (
          <div className="mt-app-5 w-full min-w-0 border-t border-unora-line/70 pt-app-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    globalThis.document.body
  );
}
