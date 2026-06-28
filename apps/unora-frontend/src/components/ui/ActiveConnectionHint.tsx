import {useState} from "react";

import {Sparkles} from "lucide-react";
import {Link} from "react-router-dom";

import {strings} from "@/features/strings";
import {useActiveConnection} from "@/hooks/useActiveConnection";
import {cn} from "@/lib/cn";
import {routes} from "@/lib/routes";

import {Avatar} from "./Avatar";

const ac = strings.discover.activeConnection;

function pickActiveConnectionTagline(): string {
  const lines = ac.taglines;
  const i = Math.floor(Math.random() * lines.length);
  return lines[i] ?? lines[0] ?? "";
}

export interface ActiveConnectionHintProps {
  className?: string;
  /** Primary tap target — active chat / connection screen */
  connectionHref?: string;
}

/** Decorative 2×3 dot grip (reference layout). */
function ConnectionDragGrip({className}: {className?: string}) {
  return (
    <div
      className={cn(
        "grid shrink-0 grid-cols-2 gap-x-[5px] gap-y-[5px] px-app-1 py-0.5",
        className
      )}
      aria-hidden>
      {Array.from({length: 6}, (_, i) => (
        <span
          key={i}
          className="block h-[5px] w-[5px] rounded-full bg-unora-brand"
        />
      ))}
    </div>
  );
}

/**
 * Neo-pill callout: thick border, theme “avatar” disc, core tagline, dot grip.
 * Entire bar navigates to **Connection**; **Interested** stays a separate caption link.
 */
export function ActiveConnectionHint({
  className,
  connectionHref = routes.connection,
}: ActiveConnectionHintProps) {
  /** New line each time this block mounts (e.g. navigating back to Discover). Stable across refetches. */
  const [tagline] = useState(pickActiveConnectionTagline);
  const active = useActiveConnection();
  const peer = active.data?.peer;
  const primaryPhoto = peer?.photos[0];

  return (
    <div className={cn("space-y-app-2", className)}>
      <div className="active-connection-hint-frame group">
        <div className="active-connection-hint-orbit" aria-hidden />
        <Link
          to={connectionHref}
          className={cn(
            "tap-highlight-none relative z-10 flex w-full items-start gap-app-3 overflow-hidden rounded-[calc(1.5rem-2px)] border border-unora-line/55 p-app-3",
            /* Opaque stops only — otherwise the rotating orbit reads through and looks like a moving card fill */
            "bg-gradient-to-br from-unora-snow via-unora-blush to-unora-cloud",
            "shadow-[inset_0_1px_0_rgb(255_255_255_/_0.65)]",
            "transition-transform duration-200 ease-out hover:scale-[0.995] active:scale-[0.98]",
            "group-hover:border-unora-brand-strong/20 group-hover:from-unora-cloud group-hover:via-unora-blush group-hover:to-unora-snow"
          )}>
          {peer ? (
            <Avatar
              src={primaryPhoto?.url}
              alt={primaryPhoto?.alt ?? `${peer.displayName} profile photo`}
              size="md"
              fallback={peer.displayName}
              className={cn(
                "mt-0.5 shrink-0 rounded-full border-[3px] border-unora-line/80 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.25)]",
                "ring-2 ring-unora-brand/35 ring-offset-2 ring-offset-unora-snow"
              )}
            />
          ) : (
            <span
              className={cn(
                "mt-0.5 h-11 w-11 shrink-0 rounded-full border-[3px] border-unora-line/80 bg-unora-brand",
                "shadow-[inset_0_1px_0_rgb(255_255_255_/_0.25)] ring-2 ring-unora-brand/40 ring-offset-2 ring-offset-unora-snow"
              )}
              aria-hidden
            />
          )}

          <div className="min-w-0 flex-1 space-y-1.5 pr-app-1">
            <p
              className={cn(
                "truncate text-base font-semibold leading-tight tracking-tight text-unora-ink",
                !peer && "text-unora-mist"
              )}>
              {peer?.displayName ?? ac.unnamedMatch}
            </p>
            <div className="flex min-w-0 items-center gap-2">
              <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
                <span
                  className={cn(
                    "absolute inset-0 animate-ping rounded-full bg-unora-brand-strong/45",
                    "[@media(prefers-reduced-motion:reduce)]:animate-none"
                  )}
                />
                <span className="relative block h-2 w-2 rounded-full bg-unora-brand-strong shadow-[0_0_0_2px_rgb(var(--u-snow)/1)]" />
              </span>
              <p className="min-w-0 truncate text-xs font-medium tracking-wide text-unora-mist">
                {ac.title}
              </p>
            </div>
            <div className="flex items-start gap-1.5">
              <Sparkles
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-unora-brand-strong/85"
                strokeWidth={2}
                aria-hidden
              />
              <p className="line-clamp-2 flex-1 text-left text-[11px] font-medium leading-snug text-unora-brand-strong">
                {tagline}
              </p>
            </div>
          </div>

          <ConnectionDragGrip className="pointer-events-none shrink-0 self-center opacity-80 transition-opacity duration-200 group-hover:opacity-100" />
        </Link>
      </div>
    </div>
  );
}
