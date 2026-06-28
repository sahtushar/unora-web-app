import {type ReactNode, Suspense, lazy} from "react";

import {Navigate, createBrowserRouter} from "react-router-dom";

import {AuthShell} from "@/features/auth/AuthShell";
import {RequireAuth} from "@/features/auth/RequireAuth";
import {routes} from "@/lib/routes";

import {AppShell} from "./layout/AppShell";
import {LoginRouteFallback} from "./router/LoginRouteFallback";
import {RouteErrorBoundary} from "./router/RouteErrorBoundary";
import {RouteFallback} from "./router/RouteFallback";

const DiscoverPage = lazy(() => import("@/features/discover/DiscoverPage"));
const DetailedProfilePage = lazy(
  () => import("@/features/discover/DetailedProfilePage")
);
const ConnectionPage = lazy(
  () => import("@/features/connection/ConnectionPage")
);
const InterestedPage = lazy(
  () => import("@/features/interested/InterestedPage")
);
const ProfilePage = lazy(() => import("@/features/profile/ProfilePage"));
const ProfileEditPage = lazy(
  () => import("@/features/profile/ProfileEditPage")
);
const ProfileEditIndex = lazy(async () => {
  const m = await import("@/features/profile/ProfileEditPage");
  return {default: m.ProfileEditIndex};
});
const ProfileInterestsPage = lazy(
  () => import("@/features/profile/ProfileInterestsPage")
);
const ProfileCompletionFlowPage = lazy(
  () => import("@/features/profile/ProfileCompletionFlowPage")
);
const LoginPage = lazy(() => import("@/features/auth/LoginPage"));

function withSuspense(node: ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{node}</Suspense>;
}

function withLoginSuspense(node: ReactNode) {
  return <Suspense fallback={<LoginRouteFallback />}>{node}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: routes.login,
    element: <AuthShell />,
    errorElement: <RouteErrorBoundary />,
    children: [{index: true, element: withLoginSuspense(<LoginPage />)}],
  },
  {
    path: "/",
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: routes.completeProfile.slice(1),
        element: withSuspense(<ProfileCompletionFlowPage />),
      },
      {index: true, element: withSuspense(<DiscoverPage />)},
      {
        path: "discover/:profileId",
        element: withSuspense(<DetailedProfilePage />),
      },
      {
        path: routes.connection.slice(1),
        element: withSuspense(<ConnectionPage />),
      },
      {
        path: routes.interested.slice(1),
        element: withSuspense(<InterestedPage />),
      },
      {
        path: routes.profileEdit.slice(1),
        element: withSuspense(<ProfileEditPage />),
        children: [
          {
            index: true,
            element: withSuspense(<ProfileEditIndex />),
          },
          {
            path: "interests",
            element: withSuspense(<ProfileInterestsPage />),
          },
        ],
      },
      {path: routes.profile.slice(1), element: withSuspense(<ProfilePage />)},
      {path: "*", element: <Navigate to={routes.discover} replace />},
    ],
  },
]);
