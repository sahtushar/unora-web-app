import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {readJwtExpSeconds} from "@/lib/jwtExp";
import {runSessionReset} from "@/lib/sessionResetRegistry";
import {postLogout, refreshAuthTokens} from "@/services/authApi";
import {registerAuthHttpBridge} from "@/services/authHttpBridge";
import {
  clearAuthStorage,
  persistAccessTokenOnly,
  persistAuthPair,
  readStoredAccessToken,
  readStoredRefreshToken,
} from "@/services/authStorage";

import {AuthContext} from "./auth-context";
import type {AuthContextValue, SignInPayload} from "./auth-types";

export function AuthProvider({children}: {children: ReactNode}) {
  const [token, setToken] = useState<string | null>(() =>
    readStoredAccessToken()
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(() =>
    readStoredRefreshToken()
  );

  const accessRef = useRef<string | null>(token);
  const refreshRef = useRef<string | null>(refreshToken);
  accessRef.current = token;
  refreshRef.current = refreshToken;

  useEffect(() => {
    registerAuthHttpBridge({
      getAccessToken: () => accessRef.current ?? undefined,
      getRefreshToken: () => refreshRef.current ?? undefined,
      applyRefreshedTokens: (accessToken, nextRefresh) => {
        persistAuthPair(accessToken, nextRefresh);
        accessRef.current = accessToken;
        refreshRef.current = nextRefresh;
        setToken(accessToken);
        setRefreshToken(nextRefresh);
      },
      clearSession: () => {
        clearAuthStorage();
        runSessionReset();
        accessRef.current = null;
        refreshRef.current = null;
        setToken(null);
        setRefreshToken(null);
      },
    });
    return () => registerAuthHttpBridge(null);
  }, []);

  useEffect(() => {
    if (token === null || refreshToken === null) {
      return;
    }
    const exp = readJwtExpSeconds(token);
    if (exp === null) {
      return;
    }
    const delay = Math.max(exp * 1000 - Date.now() - 60_000, 15_000);
    const id = window.setTimeout(() => {
      void (async () => {
        const rt = refreshRef.current;
        if (rt === null || rt.length === 0) {
          return;
        }
        try {
          const bundle = await refreshAuthTokens(rt);
          persistAuthPair(bundle.accessToken, bundle.refreshToken);
          accessRef.current = bundle.accessToken;
          refreshRef.current = bundle.refreshToken;
          setToken(bundle.accessToken);
          setRefreshToken(bundle.refreshToken);
        } catch {
          clearAuthStorage();
          accessRef.current = null;
          refreshRef.current = null;
          setToken(null);
          setRefreshToken(null);
        }
      })();
    }, delay);
    return () => window.clearTimeout(id);
  }, [token, refreshToken]);

  const signIn = useCallback((payload: SignInPayload) => {
    const nextRefresh = payload.refreshToken;
    if (
      nextRefresh !== undefined &&
      nextRefresh !== null &&
      nextRefresh.length > 0
    ) {
      persistAuthPair(payload.accessToken, nextRefresh);
      refreshRef.current = nextRefresh;
    } else {
      persistAccessTokenOnly(payload.accessToken);
      refreshRef.current = null;
    }
    accessRef.current = payload.accessToken;
    setToken(payload.accessToken);
    setRefreshToken(
      nextRefresh !== undefined &&
        nextRefresh !== null &&
        nextRefresh.length > 0
        ? nextRefresh
        : null
    );
  }, []);

  const signOut = useCallback(async () => {
    const rt = refreshRef.current;
    if (rt !== null && rt.length > 0) {
      try {
        await postLogout(rt);
      } catch {
        /* still clear local session */
      }
    }
    try {
      window.google?.accounts?.id?.disableAutoSelect?.();
    } catch {
      /* ignore */
    }
    clearAuthStorage();
    runSessionReset();
    accessRef.current = null;
    refreshRef.current = null;
    setToken(null);
    setRefreshToken(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      signIn,
      signOut,
    }),
    [token, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
