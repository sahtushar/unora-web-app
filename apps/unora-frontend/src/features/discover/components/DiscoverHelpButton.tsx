import {cn} from "@/lib/cn";

import {strings} from "../../strings";

export function DiscoverHelpButton({className}: {className?: string}) {
  return (
    <button
      type="button"
      aria-label={strings.discover.helpAriaLabel}
      className={cn(
        "tap-highlight-none flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-unora-line/90 bg-white/90 text-unora-mist shadow-soft transition-all duration-200 hover:border-unora-ink/15 hover:text-unora-ink active:scale-95",
        className
      )}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M9.5 9.5a2.5 2.5 0 014.2-1.8M12 17v-.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
