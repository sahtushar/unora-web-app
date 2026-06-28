import type {ReactNode} from "react";

import {Navigate, useLocation} from "react-router-dom";

import {routes} from "@/lib/routes";

import {useAuth} from "./useAuth";

export function RequireAuth({children}: {children: ReactNode}) {
  const {isAuthenticated} = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate to={routes.login} replace state={{from: location.pathname}} />
    );
  }

  return children;
}
