import {Link, Outlet, useLocation, useOutletContext} from "react-router-dom";

import {ScreenSkeleton} from "@/components/ui";
import {useCurrentUser} from "@/hooks/useCurrentUser";
import {cn} from "@/lib/cn";
import {routes} from "@/lib/routes";
import type {CurrentUserProfile} from "@/types";

import {strings} from "../strings";
import {ProfileCreationFeature} from "./ProfileCreationFeature";
import {PROFILE_INTERESTS_SECTION_ID} from "./profileAnchors";
import type {ProfileEditOutletContext} from "./profileEditOutletContext";
import {useProfileCreation} from "./useProfileCreation";

const p = strings.profile;
const pc = strings.profile.profileCreation;

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ProfileEditIndex() {
  const {user, profile} = useOutletContext<ProfileEditOutletContext>();
  return <ProfileCreationFeature user={user} profile={profile} />;
}

function ProfileEditLayoutBody({user}: {user: CurrentUserProfile}) {
  const location = useLocation();
  const profileApi = useProfileCreation(user);

  const onInterests = location.pathname === routes.profileEditInterests;
  const backTo = onInterests
    ? {pathname: routes.profileEdit, hash: PROFILE_INTERESTS_SECTION_ID}
    : routes.profile;
  const backAria = onInterests ? pc.interestPicker.backAria : p.edit.backAria;
  const title = onInterests ? pc.interestPicker.title : p.edit.title;

  return (
    <div className="space-y-app-6 py-app-2">
      <header className="flex items-center gap-app-2">
        <Link
          to={backTo}
          aria-label={backAria}
          className={cn(
            "tap-highlight-none inline-flex h-11 w-11 items-center justify-center rounded-2xl text-unora-ink transition-colors hover:bg-unora-cloud/80 active:scale-[0.98]"
          )}>
          <BackIcon />
        </Link>
        <h1 className="font-display text-[1.35rem] font-medium tracking-tight text-unora-ink">
          {title}
        </h1>
      </header>

      <Outlet
        context={{user, profile: profileApi} satisfies ProfileEditOutletContext}
      />
    </div>
  );
}

export default function ProfileEditPage() {
  const me = useCurrentUser();

  if (me.isLoading || !me.data) {
    return <ScreenSkeleton variant="profile" />;
  }

  return <ProfileEditLayoutBody user={me.data} />;
}
