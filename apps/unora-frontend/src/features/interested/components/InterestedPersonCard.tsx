import {memo, useCallback, useState} from "react";

import {ArrowRight, Heart, X} from "lucide-react";
import {useNavigate} from "react-router-dom";

import {LazyImage} from "@/components/ui";
import {useActiveConnection} from "@/hooks/useActiveConnection";
import {cn} from "@/lib/cn";
import {routes} from "@/lib/routes";
import type {InterestedPerson} from "@/types";

import {strings} from "../../strings";
import {InterestedSwitchConnectionModal} from "./InterestedSwitchConnectionModal";

export interface InterestedPersonCardProps {
  person: InterestedPerson;
}

export const InterestedPersonCard = memo(function InterestedPersonCard({
  person,
}: InterestedPersonCardProps) {
  const navigate = useNavigate();
  const connection = useActiveConnection();
  const [swapModalOpen, setSwapModalOpen] = useState(false);

  const s = strings.interested.matchTile;
  const isMutualMatch = person.status === "ready_to_connect";

  const handleMutualFooterClick = useCallback(() => {
    if (connection.data) {
      setSwapModalOpen(true);
      return;
    }
    navigate(routes.connection);
  }, [connection.data, navigate]);

  const handleConfirmSwitch = useCallback(() => {
    setSwapModalOpen(false);
    navigate(routes.connection);
  }, [navigate]);

  const nameAge =
    person.age === undefined
      ? person.displayName
      : s.nameAgeLine(person.displayName, person.age);

  return (
    <>
      <article
        className={cn(
          "relative overflow-hidden rounded-2xl border border-unora-line/85 bg-unora-cloud/30 shadow-soft",
          "aspect-[3/4] w-full"
        )}>
        <LazyImage
          src={person.photo.url}
          alt={person.photo.alt}
          className="absolute inset-0 h-full w-full"
        />

        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-unora-ink/85 via-unora-ink/20 to-transparent"
          aria-hidden
        />

        {isMutualMatch ? (
          <div
            className="absolute right-app-2 top-app-2 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-unora-line/70 bg-unora-snow/95 shadow-soft backdrop-blur-sm"
            title={s.readyBadgeLabel}>
            <Heart
              className="h-4 w-4 text-unora-brand-strong"
              fill="currentColor"
              strokeWidth={1.75}
              aria-hidden
            />
            <span className="sr-only">{s.readyBadgeLabel}</span>
          </div>
        ) : null}

        <div className="pointer-events-none absolute inset-x-0 bottom-12 px-app-3">
          <p className="font-display text-base font-semibold leading-tight tracking-tight text-unora-snow drop-shadow-sm">
            {nameAge}
          </p>
        </div>

        <div
          className={cn(
            "absolute inset-x-0 bottom-0 z-10 flex h-[2.50rem]",
            isMutualMatch ? "" : "divide-x divide-unora-snow/25",
            "border-t border-unora-snow/15 bg-unora-ink/45 backdrop-blur-xl backdrop-saturate-150"
          )}>
          {isMutualMatch ? (
            <button
              type="button"
              onClick={handleMutualFooterClick}
              aria-label={s.goToConnectionAria}
              className="tap-highlight-none flex min-h-0 w-full flex-1 items-center justify-center gap-app-1 text-unora-snow/95 transition active:scale-[0.98]">
              <ArrowRight className="h-6 w-6" strokeWidth={2.25} aria-hidden />
            </button>
          ) : (
            <>
              <button
                type="button"
                disabled
                aria-label={s.passLabel}
                title={s.actionsDisabledHint}
                className="tap-highlight-none flex flex-1 items-center justify-center text-unora-snow/95 transition enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55">
                <X className="h-6 w-6" strokeWidth={2.25} aria-hidden />
              </button>
              <button
                type="button"
                disabled
                aria-label={s.likeLabel}
                title={s.actionsDisabledHint}
                className="tap-highlight-none flex flex-1 items-center justify-center text-unora-snow/95 transition enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55">
                <Heart className="h-6 w-6" strokeWidth={2} aria-hidden />
              </button>
            </>
          )}
        </div>
      </article>

      {isMutualMatch && swapModalOpen && connection.data ? (
        <InterestedSwitchConnectionModal
          open={swapModalOpen}
          onClose={() => setSwapModalOpen(false)}
          currentPeer={connection.data.peer}
          incoming={person}
          onConfirm={handleConfirmSwitch}
        />
      ) : null}
    </>
  );
});
