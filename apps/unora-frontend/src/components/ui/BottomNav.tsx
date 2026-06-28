import type {LucideIcon} from "lucide-react";
import {Heart, MessageSquare, Sun, UserRound} from "lucide-react";
import {NavLink} from "react-router-dom";

import {cn} from "@/lib/cn";
import {routes} from "@/lib/routes";

const navIconProps = {
  size: 22,
  strokeWidth: 1.5,
  "aria-hidden": true as const,
};

const items: readonly {
  Icon: LucideIcon;
  label: string;
  to: string;
}[] = [
  {to: routes.discover, label: "Discover", Icon: Sun},
  {to: routes.connection, label: "Connection", Icon: MessageSquare},
  {to: routes.interested, label: "Matches", Icon: Heart},
  {to: routes.profile, label: "Profile", Icon: UserRound},
];

export function BottomNav() {
  return (
    <nav
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center"
      aria-label="Primary">
      <div className="pointer-events-auto w-full max-w-app px-app-4 pb-[max(env(safe-area-inset-bottom),theme(spacing.app-3))] pt-app-3">
        <div className="flex items-stretch gap-app-1 rounded-2xl border border-unora-line/85 bg-unora-snow/96 p-app-1 shadow-nav ring-1 ring-inset ring-unora-line/35 bg-white">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === routes.discover}
              className={({isActive}) =>
                cn(
                  "tap-highlight-none flex min-h-[48px] min-w-0 flex-1 flex-col items-center justify-center gap-app-1 rounded-xl py-app-2 text-[10px] font-semibold uppercase tracking-wider transition-all duration-200 ease-out",
                  "active:scale-[0.97]",
                  isActive
                    ? "bg-unora-ink text-unora-snow shadow-soft ring-1 ring-unora-brand/35"
                    : "text-unora-ink/78 hover:bg-unora-cloud/85 hover:text-unora-ink"
                )
              }>
              {({isActive}) => (
                <>
                  <item.Icon
                    {...navIconProps}
                    className={cn(
                      "shrink-0",
                      isActive ? "text-unora-snow" : "text-current"
                    )}
                  />
                  <span className="truncate px-app-1">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
