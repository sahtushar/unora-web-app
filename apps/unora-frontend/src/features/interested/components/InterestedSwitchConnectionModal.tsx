import {useCallback} from "react";

import {ArrowRight, MessageCircle, Shuffle, Sparkles} from "lucide-react";

import {Avatar, Button, Modal} from "@/components/ui";
import {cn} from "@/lib/cn";
import type {DiscoverProfile, InterestedPerson} from "@/types";

import {strings} from "../../strings";

const emphasis = "font-semibold text-unora-ink";
const emphasisBrand = "font-semibold text-unora-brand-strong";

export interface InterestedSwitchConnectionModalProps {
  currentPeer: DiscoverProfile;
  incoming: InterestedPerson;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function InterestedSwitchConnectionModal({
  open,
  onClose,
  currentPeer,
  incoming,
  onConfirm,
}: InterestedSwitchConnectionModalProps) {
  const m = strings.interested.switchConnectionModal;

  const currentPhoto = currentPeer.photos[0];
  const incomingPhoto = incoming.photo;

  const currentLine = m.personLine(currentPeer.displayName, currentPeer.age);
  const incomingLine = m.personLine(incoming.displayName, incoming.age);

  const handleConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  const title = (
    <span className="flex items-start gap-app-2">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-unora-line/85 bg-unora-cloud/70 text-unora-brand-strong shadow-soft">
        <Shuffle className="h-5 w-5" strokeWidth={1.85} aria-hidden />
      </span>
      <span className="min-w-0 pt-0.5">{m.title}</span>
    </span>
  );

  const description = (
    <div className="space-y-app-3">
      <p>
        {m.leadStart}
        <span className={emphasis}>{m.leadEmphasis}</span>
        {m.leadEnd}
      </p>
      <p className="leading-relaxed">
        {m.hookStart}
        <span className={emphasisBrand}>{m.hookEmphasisConnection}</span>
        {m.hookMid}
        <span className={emphasis}>{m.hookEmphasisKind}</span>
        {m.hookEnd}
        <MessageCircle
          className="ml-1 inline-block h-[1.1em] w-[1.1em] shrink-0 align-[-0.12em] text-unora-brand-strong/90"
          strokeWidth={2}
          aria-hidden
        />
      </p>
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      backdropDismissAriaLabel={m.backdropDismissAria}
      closeAriaLabel={m.closeAria}
      className="border-unora-line/95 bg-gradient-to-b from-unora-snow via-unora-blush/20 to-unora-cloud/45"
      footer={
        <div className="flex w-full min-w-0 flex-col gap-app-2 sm:flex-row-reverse">
          <Button
            type="button"
            variant="primary"
            className="w-full gap-app-2 sm:flex-1"
            onClick={handleConfirm}>
            <span>{m.confirmCta}</span>
            <Sparkles className="h-4 w-4 shrink-0 opacity-95" aria-hidden />
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:flex-1"
            onClick={onClose}>
            {m.cancelCta}
          </Button>
        </div>
      }>
      <div
        className={cn(
          "rounded-2xl border border-unora-line/80 bg-gradient-to-br from-unora-cloud/55 via-unora-snow to-unora-blush/25 p-app-4",
          "shadow-soft ring-1 ring-inset ring-unora-line/40"
        )}>
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-unora-mist">
          {m.swapDiagramLabel}
        </p>
        <div className="mt-app-4 flex items-center justify-center gap-app-2 sm:gap-app-3">
          <figure className="flex min-w-0 flex-1 flex-col items-center gap-app-2 text-center">
            <Avatar
              src={currentPhoto?.url ?? null}
              alt={currentPhoto?.alt ?? currentPeer.displayName}
              fallback={currentPeer.displayName}
              size="lg"
              className="rounded-full ring-2 ring-unora-line/80 ring-offset-2 ring-offset-unora-snow"
            />
            <figcaption className="w-full min-w-0">
              <span className="block text-[10px] font-semibold uppercase tracking-wide text-unora-mist">
                {m.currentLabel}
              </span>
              <span className="mt-0.5 block truncate font-display text-sm font-semibold text-unora-ink">
                {currentLine}
              </span>
            </figcaption>
          </figure>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-unora-line/70 bg-unora-snow/90 shadow-soft">
            <ArrowRight
              className="h-5 w-5 text-unora-brand-strong"
              strokeWidth={2.25}
              aria-hidden
            />
          </div>

          <figure className="flex min-w-0 flex-1 flex-col items-center gap-app-2 text-center">
            <div className="relative">
              <Avatar
                src={incomingPhoto.url}
                alt={incomingPhoto.alt}
                fallback={incoming.displayName}
                size="lg"
                className="rounded-full ring-2 ring-unora-brand/40 ring-offset-2 ring-offset-unora-snow"
              />
              <span
                className="pointer-events-none absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full border border-unora-line/75 bg-unora-snow text-unora-brand-strong shadow-soft"
                aria-hidden>
                <Sparkles className="h-3.5 w-3.5" strokeWidth={2.25} />
              </span>
            </div>
            <figcaption className="w-full min-w-0">
              <span className="inline-flex items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-unora-mist">
                <Sparkles
                  className="h-3 w-3 shrink-0 text-unora-brand-strong"
                  aria-hidden
                />
                {m.incomingLabel}
              </span>
              <span className="mt-0.5 block truncate font-display text-sm font-semibold text-unora-ink">
                {incomingLine}
              </span>
            </figcaption>
          </figure>
        </div>
      </div>
      <p
        className={cn(
          "mt-app-4 rounded-xl border border-unora-line/60 bg-unora-cloud/45 px-app-3 py-app-2.5 text-center text-[11px] leading-relaxed text-unora-mist"
        )}>
        {m.previewNote}
      </p>
    </Modal>
  );
}
