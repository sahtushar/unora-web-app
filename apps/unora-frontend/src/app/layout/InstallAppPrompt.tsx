import {useEffect, useMemo, useState} from "react";

import {Download, PlusSquare, Share2, Smartphone, X} from "lucide-react";

import {Button, useToast} from "@/components/ui";
import {strings} from "@/features/strings";

const DISMISS_KEY = "unora-install-prompt-dismissed-v1";

function isStandaloneMode(): boolean {
  if (globalThis.matchMedia?.("(display-mode: standalone)").matches) {
    return true;
  }
  return globalThis.navigator.standalone === true;
}

function isIosBrowser(): boolean {
  const ua = globalThis.navigator.userAgent.toLowerCase();
  const iosDevice =
    ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod");
  const msStream = "MSStream" in globalThis;
  return iosDevice && !msStream;
}

export function InstallAppPrompt({
  hideForCurrentRoute = false,
}: {
  hideForCurrentRoute?: boolean;
}) {
  const c = strings.installPrompt;
  const {showToast} = useToast();

  const [dismissed, setDismissed] = useState(() => {
    if (globalThis.localStorage === undefined) {
      return false;
    }
    return globalThis.localStorage.getItem(DISMISS_KEY) === "1";
  });
  const [installed, setInstalled] = useState(isStandaloneMode);
  const [promptEvent, setPromptEvent] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const onBeforeInstallPrompt = (event: Event) => {
      const e = event as BeforeInstallPromptEvent;
      e.preventDefault();
      setPromptEvent(e);
    };

    const onInstalled = () => {
      setInstalled(true);
      setPromptEvent(null);
      showToast({
        tone: "success",
        title: c.installedTitle,
        description: c.installedDescription,
      });
    };

    globalThis.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    globalThis.addEventListener("appinstalled", onInstalled);
    return () => {
      globalThis.removeEventListener(
        "beforeinstallprompt",
        onBeforeInstallPrompt
      );
      globalThis.removeEventListener("appinstalled", onInstalled);
    };
  }, [c.installedDescription, c.installedTitle, showToast]);

  const mode = useMemo(() => {
    if (installed || dismissed || hideForCurrentRoute) {
      return null;
    }
    if (promptEvent !== null) {
      return "prompt";
    }
    if (isIosBrowser()) {
      return "ios";
    }
    return null;
  }, [dismissed, hideForCurrentRoute, installed, promptEvent]);

  const dismiss = () => {
    setDismissed(true);
    globalThis.localStorage?.setItem(DISMISS_KEY, "1");
  };

  const onInstallClick = async () => {
    if (promptEvent === null) {
      return;
    }
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    if (choice.outcome === "accepted") {
      setDismissed(true);
    }
    setPromptEvent(null);
  };

  if (mode === null) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[5.25rem] z-[52] flex justify-center px-app-4 sm:bottom-[6.5rem]">
      <section className="pointer-events-auto w-full max-w-app rounded-2xl border border-unora-line/85 bg-white/95 px-app-3 py-app-3 shadow-nav ring-1 ring-inset ring-unora-line/35 backdrop-blur-xl">
        <div className="flex items-start gap-app-2">
          <div className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-unora-line/80 bg-unora-cloud/45">
            <Smartphone className="h-4 w-4 text-unora-brand-strong" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-unora-ink">{c.title}</p>
            {mode === "prompt" ? (
              <p className="mt-0.5 text-xs leading-relaxed text-unora-mist">
                {c.description}
              </p>
            ) : (
              <p className="mt-0.5 text-xs leading-relaxed text-unora-mist">
                {c.iosDescription}
              </p>
            )}
            {mode === "ios" ? (
              <p className="mt-1 inline-flex flex-wrap items-center gap-1 text-xs font-medium text-unora-ink/85">
                <Share2 className="h-3.5 w-3.5" />
                {c.iosStepShare}
                <PlusSquare className="h-3.5 w-3.5" />
                {c.iosStepAdd}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="tap-highlight-none inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-unora-line/80 text-unora-mist transition hover:bg-unora-cloud/55 hover:text-unora-ink"
            aria-label={c.dismissAria}>
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-app-3">
          {mode === "prompt" ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-9 w-full justify-center rounded-xl font-semibold"
              onClick={() => {
                void onInstallClick();
              }}>
              <Download className="mr-1.5 h-4 w-4" />
              {c.installCta}
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-9 w-full justify-center rounded-xl border border-unora-line/80 bg-unora-cloud/35 text-xs text-unora-ink/90"
              onClick={dismiss}>
              {c.iosGotItCta}
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
