import {AlertTriangle, CheckCircle2, Info, X} from "lucide-react";

import {cn} from "@/lib/cn";

export type ToastTone = "info" | "success" | "error";

export interface ToastProps {
  title: string;
  description?: string;
  tone?: ToastTone;
  onDismiss?: () => void;
}

const toneStyles: Record<ToastTone, {frame: string; icon: string}> = {
  error: {
    frame:
      "border-rose-300/70 bg-gradient-to-b from-rose-50/95 to-white text-rose-950 shadow-[0_16px_40px_-22px_rgba(190,24,93,0.45)]",
    icon: "text-rose-600",
  },
  info: {
    frame:
      "border-unora-line/70 bg-gradient-to-b from-white to-unora-cloud/45 text-unora-ink shadow-soft",
    icon: "text-unora-brand-strong",
  },
  success: {
    frame:
      "border-emerald-300/70 bg-gradient-to-b from-emerald-50/95 to-white text-emerald-950 shadow-[0_16px_40px_-22px_rgba(5,150,105,0.45)]",
    icon: "text-emerald-600",
  },
};

function ToneIcon({tone}: {tone: ToastTone}) {
  if (tone === "success") {
    return <CheckCircle2 className="h-4.5 w-4.5" />;
  }
  if (tone === "error") {
    return <AlertTriangle className="h-4.5 w-4.5" />;
  }
  return <Info className="h-4.5 w-4.5" />;
}

export function Toast({
  title,
  description,
  tone = "info",
  onDismiss,
}: ToastProps) {
  const style = toneStyles[tone];

  return (
    <div
      aria-live="polite"
      className={cn(
        "pointer-events-auto w-full rounded-2xl border px-app-3 py-app-3 backdrop-blur-sm transition-all",
        style.frame
      )}>
      <div className="flex items-start gap-app-2">
        <span
          className={cn(
            "mt-0.5 inline-flex shrink-0 items-center justify-center",
            style.icon
          )}>
          <ToneIcon tone={tone} />
        </span>
        <div className="min-w-0 flex-1 space-y-0.5">
          <p className="text-sm font-semibold leading-snug">{title}</p>
          {description === undefined || description.length === 0 ? null : (
            <p className="text-sm leading-snug text-current/80">
              {description}
            </p>
          )}
        </div>
        {onDismiss === undefined ? null : (
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={onDismiss}
            className="tap-highlight-none inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-current/15 text-current/70 transition hover:bg-current/10 hover:text-current">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
