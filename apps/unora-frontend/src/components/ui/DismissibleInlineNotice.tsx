import {forwardRef} from "react";

import {cn} from "@/lib/cn";

export interface DismissibleInlineNoticeProps {
  description: string;
  dismissLabel: string;
  title: string;
  className?: string;
  /** When true, plays a one-shot border emphasis animation on mount. */
  emphasizeOnMount?: boolean;
  onDismiss: () => void;
}

export const DismissibleInlineNotice = forwardRef<
  HTMLOutputElement,
  DismissibleInlineNoticeProps
>(function DismissibleInlineNotice(
  {
    title,
    description,
    dismissLabel,
    onDismiss,
    className,
    emphasizeOnMount = true,
  },
  ref
) {
  return (
    <output
      ref={ref}
      aria-live="polite"
      className={cn(
        "block rounded-2xl border border-unora-line/90 bg-gradient-to-br from-unora-blush/40 to-unora-snow px-app-4 py-app-3 shadow-sm",
        emphasizeOnMount && "animate-notice-border-emphasis",
        className
      )}>
      <div className="flex items-start gap-app-3">
        <div className="min-w-0 flex-1 space-y-app-1">
          <p className="text-sm font-semibold tracking-tight text-unora-ink">
            {title}
          </p>
          <p className="text-xs leading-relaxed text-unora-mist">
            {description}
          </p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="tap-highlight-none shrink-0 rounded-full px-app-2 py-app-1 text-xs font-semibold text-unora-brand-strong underline-offset-2 transition-colors hover:text-unora-ink hover:underline">
          {dismissLabel}
        </button>
      </div>
    </output>
  );
});

DismissibleInlineNotice.displayName = "DismissibleInlineNotice";
