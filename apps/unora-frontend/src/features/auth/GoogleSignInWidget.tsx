import {useEffect, useRef} from "react";

import {cn} from "@/lib/cn";

import {loadGoogleIdentityScript} from "./loadGoogleIdentityScript";

type Props = {
  clientId: string;
  disabled?: boolean;
  /** Called with the Google ID token (JWT) after the user completes Sign in with Google. */
  onCredential: (idToken: string) => void;
};

type GoogleCredentialResponse = {credential?: string};

type GoogleAccountsId = {
  initialize: (options: {
    auto_select: boolean;
    cancel_on_tap_outside: boolean;
    client_id: string;
    callback: (res: GoogleCredentialResponse) => void;
  }) => void;
  prompt: () => void;
  renderButton: (
    host: HTMLElement,
    options: {
      logo_alignment: "left";
      shape: "pill";
      size: "large";
      text: "continue_with";
      theme: "filled_blue" | "outline";
      type: "standard";
      width: number;
    }
  ) => void;
};

type GoogleGlobal = typeof globalThis & {
  google?: {accounts?: {id?: GoogleAccountsId}};
};

/**
 * Google Identity Services: official button + optional One Tap prompt.
 * Refresh token stays out of localStorage (see `authStorage`); GIS only supplies the ID token.
 */
export function GoogleSignInWidget({clientId, onCredential, disabled}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const cancelledRef = useRef(false);
  const onCredentialRef = useRef(onCredential);
  onCredentialRef.current = onCredential;

  useEffect(() => {
    const host = hostRef.current;
    if (host === null || clientId.length === 0) {
      return;
    }

    cancelledRef.current = false;

    void (async () => {
      try {
        await loadGoogleIdentityScript();
      } catch {
        return;
      }
      if (cancelledRef.current === true || hostRef.current === null) {
        return;
      }

      const g = (globalThis as GoogleGlobal).google?.accounts?.id;
      if (g === undefined) {
        return;
      }

      g.initialize({
        auto_select: false,
        cancel_on_tap_outside: true,
        callback: (res: GoogleCredentialResponse) => {
          if (res.credential !== undefined && res.credential.length > 0) {
            onCredentialRef.current(res.credential);
          }
        },
        client_id: clientId,
      });

      host.innerHTML = "";
      g.renderButton(host, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "pill",
        logo_alignment: "left",
        width: 344,
      });

      const promptKey = "unora_gis_one_tap_prompted";
      if (sessionStorage.getItem(promptKey) === null) {
        sessionStorage.setItem(promptKey, "1");
        g.prompt();
      }
    })();

    return () => {
      cancelledRef.current = true;
      host.innerHTML = "";
    };
  }, [clientId]);

  return (
    <div
      className={cn(
        "flex min-h-[44px] w-full max-w-[21.5rem] justify-center rounded-full bg-white shadow-soft ring-1 ring-unora-line/70",
        "[&>div]:w-full [&_iframe]:!w-full [&_iframe]:!rounded-full",
        disabled === true && "pointer-events-none opacity-50"
      )}
      ref={hostRef}
    />
  );
}
