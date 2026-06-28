import {useCallback, useMemo, useState} from "react";

import {Mail, Sparkles} from "lucide-react";

import {Button, Modal} from "@/components/ui";
import {strings} from "@/features/strings";
import {cn} from "@/lib/cn";

const emphasis = "font-semibold text-unora-ink";
const emphasisBrand = "font-semibold text-unora-brand-strong";

/**
 * Shown once per full page load while the authenticated shell is mounted
 * (refresh opens it again; client-side navigation does not).
 */
export function PreviewWelcomeModal() {
  const w = strings.previewWelcome;
  const [open, setOpen] = useState(true);

  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent(w.emailSubject);
    return `mailto:${w.feedbackEmail}?subject=${subject}`;
  }, [w.emailSubject, w.feedbackEmail]);

  const title = (
    <span className="flex items-start gap-app-2">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-unora-line/85 bg-unora-cloud/70 text-unora-brand-strong shadow-soft">
        <Sparkles className="h-5 w-5" strokeWidth={1.85} aria-hidden />
      </span>
      <span className="min-w-0 pt-0.5">{w.title}</span>
    </span>
  );

  const description = (
    <div className="space-y-app-3">
      <p className="leading-relaxed">
        {w.leadStart}
        <span className={emphasisBrand}>{w.leadEmphasis}</span>
        {w.leadMid}
        <span className={emphasis}>{w.leadEmphasis2}</span>
        {w.leadEnd}
      </p>
      <p className="leading-relaxed">
        {w.midStart}
        <span className={emphasis}>{w.midEmphasis}</span>
        {w.midEnd}
      </p>
      <p className="leading-relaxed">{w.feedbackIntro}</p>
      <p className="leading-relaxed">
        {w.feedbackStart}
        <a
          href={mailtoHref}
          className={cn(
            emphasisBrand,
            "underline decoration-unora-brand-strong/40 underline-offset-2 transition hover:decoration-unora-brand-strong"
          )}>
          {w.feedbackEmail}
        </a>
        {w.feedbackMid}
        <span className={emphasis}>{w.feedbackEmphasis}</span>
        {w.feedbackEnd}
      </p>
    </div>
  );

  const linkSecondaryClass = cn(
    "tap-highlight-none touch-manipulation inline-flex w-full items-center justify-center gap-app-2 font-medium tracking-tight transition-all duration-200 ease-out sm:w-auto sm:flex-1",
    "h-12 rounded-2xl border border-unora-line/90 bg-white/90 px-app-5 text-[15px] text-unora-ink shadow-soft",
    "hover:border-unora-ink/15 hover:bg-unora-cloud/50 hover:shadow-card active:scale-[0.98]"
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      backdropDismissAriaLabel={w.backdropDismissAria}
      closeAriaLabel={w.closeAria}
      className="border-unora-line/95 bg-gradient-to-b from-unora-snow via-unora-blush/20 to-unora-cloud/45"
      footer={
        <div className="flex w-full min-w-0 flex-col gap-app-2 sm:flex-row">
          <Button
            type="button"
            variant="primary"
            className="w-full sm:flex-1"
            onClick={onClose}>
            {w.dismissCta}
          </Button>
          <a href={mailtoHref} className={linkSecondaryClass}>
            <Mail
              className="h-4 w-4 shrink-0 text-unora-brand-strong"
              aria-hidden
            />
            {w.feedbackCta}
          </a>
        </div>
      }
    />
  );
}
