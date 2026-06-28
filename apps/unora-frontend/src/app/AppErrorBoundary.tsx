import {Component, type ErrorInfo, type ReactNode} from "react";

import {Bug, Home, RotateCw} from "lucide-react";

import {Button} from "@/components/ui";
import {routes} from "@/lib/routes";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export class AppErrorBoundary extends Component<Props, State> {
  state: State = {hasError: false};

  static getDerivedStateFromError(): State {
    return {hasError: true};
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("AppErrorBoundary caught", error, info);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="app-canvas">
        <main className="app-shell-surface justify-center">
          <section className="mx-auto w-full max-w-app rounded-3xl border border-unora-line/70 bg-white/95 p-app-5 shadow-phone">
            <div className="inline-flex items-center gap-2 rounded-full border border-unora-line/70 bg-unora-cloud/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-unora-mist">
              <Bug className="h-3.5 w-3.5 text-unora-brand-strong" />
              Safety net active
            </div>
            <h1 className="mt-app-3 font-display text-3xl leading-tight tracking-tight text-unora-ink">
              Plot twist. The app took a wrong turn.
            </h1>
            <p className="mt-app-2 text-sm leading-relaxed text-unora-mist">
              Good news: your data is safe. Give it a quick refresh and we will
              get back to calm.
            </p>
            <div className="mt-app-5 flex flex-wrap gap-app-2">
              <Button
                variant="primary"
                onClick={() => {
                  globalThis.location.reload();
                }}>
                <RotateCw className="mr-1.5 h-4 w-4" />
                Restart app
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  globalThis.location.assign(routes.discover);
                }}>
                <Home className="mr-1.5 h-4 w-4" />
                Go to home
              </Button>
            </div>
          </section>
        </main>
      </div>
    );
  }
}
