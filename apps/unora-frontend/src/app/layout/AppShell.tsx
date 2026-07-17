import {Outlet, useLocation} from "react-router-dom";

import {BottomNav} from "@/components/ui";
import {RequireCompleteProfile} from "@/features/profile/RequireCompleteProfile";
import {routes} from "@/lib/routes";

import {InstallAppPrompt} from "./InstallAppPrompt";
import {LocationSyncGate} from "./LocationSyncGate";

export function AppShell() {
  const location = useLocation();
  const hideBottomNav = location.pathname === routes.completeProfile;

  return (
    <div className="app-canvas">
      <main className="app-shell-surface">
        <RequireCompleteProfile>
          <Outlet />
        </RequireCompleteProfile>
      </main>
      <InstallAppPrompt hideForCurrentRoute={hideBottomNav} />
      <LocationSyncGate />
      {hideBottomNav ? null : <BottomNav />}
    </div>
  );
}
