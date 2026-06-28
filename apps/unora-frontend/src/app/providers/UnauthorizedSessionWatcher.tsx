import {useEffect, useRef} from "react";

import {useToast} from "@/components/ui/ToastProvider";
import {useAuth} from "@/features/auth/useAuth";
import {routes} from "@/lib/routes";
import {onHttpUnauthorized} from "@/services/httpEvents";

export function UnauthorizedSessionWatcher() {
  const {signOut} = useAuth();
  const {showToast} = useToast();
  const handlingRef = useRef(false);
  const lastTriggeredRef = useRef(0);

  useEffect(() => {
    return onHttpUnauthorized(() => {
      const now = Date.now();
      if (handlingRef.current || now - lastTriggeredRef.current < 1500) {
        return;
      }
      handlingRef.current = true;
      lastTriggeredRef.current = now;

      void (async () => {
        try {
          await signOut();
        } finally {
          showToast({
            tone: "error",
            title: "Session expired",
            description:
              "Your session slipped out for a quick coffee. Sign in again and we will pick up right where you left off.",
            durationMs: 5200,
          });
          globalThis.location.replace(routes.login);
          handlingRef.current = false;
        }
      })();
    });
  }, [showToast, signOut]);

  return null;
}
