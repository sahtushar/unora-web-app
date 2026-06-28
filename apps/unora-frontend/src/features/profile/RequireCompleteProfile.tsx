import type {ReactNode} from "react";

import {Navigate, useLocation} from "react-router-dom";

import {ScreenSkeleton} from "@/components/ui";
import {useCurrentUser} from "@/hooks/useCurrentUser";
import {routes} from "@/lib/routes";

import {isProfileCompletionRequired} from "./profileCompletionStatus";

export function RequireCompleteProfile({children}: {children: ReactNode}) {
  const me = useCurrentUser();
  const location = useLocation();

  if (me.isLoading || !me.data) {
    return <ScreenSkeleton variant="profile" />;
  }

  const isOnCompleteProfile = location.pathname === routes.completeProfile;
  const mustCompleteProfile = isProfileCompletionRequired(me.data);

  if (mustCompleteProfile && !isOnCompleteProfile) {
    return (
      <Navigate
        to={routes.completeProfile}
        replace
        state={{from: location.pathname}}
      />
    );
  }

  if (!mustCompleteProfile && isOnCompleteProfile) {
    const from = (location.state as {from?: string} | null)?.from;
    const to =
      typeof from === "string" &&
      from.startsWith("/") &&
      from !== routes.completeProfile
        ? from
        : routes.discover;
    return <Navigate to={to} replace />;
  }

  return children;
}
