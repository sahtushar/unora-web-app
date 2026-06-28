import {type ReactNode, useEffect, useState} from "react";

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

import {ToastProvider} from "@/components/ui/ToastProvider";
import {AuthProvider} from "@/features/auth/AuthProvider";
import {registerSessionReset} from "@/lib/sessionResetRegistry";
import {ThemeProvider} from "@/theme/ThemeProvider";

import {UnauthorizedSessionWatcher} from "./UnauthorizedSessionWatcher";

export function AppProviders({children}: {children: ReactNode}) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  useEffect(() => {
    return registerSessionReset(() => {
      void client.cancelQueries();
      client.clear();
    });
  }, [client]);

  return (
    <ThemeProvider>
      <QueryClientProvider client={client}>
        <AuthProvider>
          <ToastProvider>
            <UnauthorizedSessionWatcher />
            {children}
          </ToastProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
