import {AlertTriangle, Home, RefreshCw} from "lucide-react";
import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "react-router-dom";

import {Button} from "@/components/ui";
import {routes} from "@/lib/routes";

function titleForStatus(status: number | null): string {
  if (status === 401) {
    return "Door locked itself";
  }
  if (status === 404) {
    return "This page wandered off";
  }
  if (status !== null && status >= 500) {
    return "Our side tripped over a cable";
  }
  return "Unexpected detour";
}

function descriptionForStatus(status: number | null): string {
  if (status === 401) {
    return "Your session clock ran out. Hop back in and we will continue from there.";
  }
  if (status === 404) {
    return "The page you asked for is not here anymore. Let us steer you to a calmer place.";
  }
  if (status !== null && status >= 500) {
    return "Something on our side had a wobble. A refresh usually gets everything back on track.";
  }
  return "That did not go as planned, but nothing is lost. Try a refresh or head home.";
}

export function RouteErrorBoundary() {
  const navigate = useNavigate();
  const error = useRouteError();

  const status = isRouteErrorResponse(error) ? error.status : null;
  const title = titleForStatus(status);
  const description = descriptionForStatus(status);

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-app items-center px-app-4 py-app-8">
      <div className="w-full rounded-3xl border border-unora-line/70 bg-white/95 p-app-5 shadow-phone">
        <div className="inline-flex items-center gap-2 rounded-full border border-unora-line/70 bg-unora-cloud/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-unora-mist">
          <AlertTriangle className="h-3.5 w-3.5 text-unora-brand-strong" />
          Graceful recovery
        </div>
        <h1 className="mt-app-3 font-display text-3xl leading-tight tracking-tight text-unora-ink">
          {title}
        </h1>
        <p className="mt-app-2 text-sm leading-relaxed text-unora-mist">
          {description}
        </p>
        <div className="mt-app-5 flex flex-wrap gap-app-2">
          <Button
            variant="primary"
            onClick={() => {
              globalThis.location.reload();
            }}>
            <RefreshCw className="mr-1.5 h-4 w-4" />
            Refresh app
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              navigate(routes.discover, {replace: true});
            }}>
            <Home className="mr-1.5 h-4 w-4" />
            Go to home
          </Button>
        </div>
      </div>
    </div>
  );
}
