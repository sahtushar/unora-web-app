import {Outlet} from "react-router-dom";

/**
 * Auth routes use the same premium “device column” language as the main app, without tab chrome.
 */
export function AuthShell() {
  return (
    <div className="app-canvas">
      <div className="app-shell-surface flex min-h-dvh flex-col !pb-app-8">
        <Outlet />
      </div>
    </div>
  );
}
