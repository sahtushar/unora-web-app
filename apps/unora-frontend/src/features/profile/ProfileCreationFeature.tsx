import {useCallback, useEffect, useRef, useState} from "react";

import {useQueryClient} from "@tanstack/react-query";
import {useLocation} from "react-router-dom";

import {cn} from "@/lib/cn";
import {shouldPersistProfilePhotosViaApi} from "@/services/liveProfile";
import {patchUserProfileDetails} from "@/services/profileDetailsApi";
import {queryKeys} from "@/services/queryKeys";
import {
  deleteUserPhoto,
  persistNewDataUrlPhotos,
} from "@/services/userPhotosApi";
import type {CurrentUserProfile, Photo} from "@/types";

import {strings} from "../strings";
import {CityLocationPicker} from "./CityLocationPicker";
import {ProfileEditorPreviewView} from "./ProfileEditorPreviewView";
import {
  ProfileCreationAlignmentSection,
  ProfileCreationBasicsSection,
  ProfileCreationBioSection,
  ProfileCreationCompletionSection,
  ProfileCreationConversationStarterSection,
  ProfileCreationInterestsSection,
  ProfileCreationLifestyleSection,
  ProfileCreationPhotosSection,
  ProfileCreationPreferencesSection,
  ProfileCreationVerificationSection,
} from "./profileCreation";
import {
  type ProfileBasicsDraftSlice,
  type ProfilePreferencesDraft,
  pickProfileBasicsDraft,
  profileBasicsDraftToPatchBody,
  profilePreferencesDraftToUserSlice,
} from "./profileCreationModel";
import type {ProfileCreationController} from "./useProfileCreation";
import {useProfileEditHashScroll} from "./useProfileEditHashScroll";

const p = strings.profile;

export function ProfileCreationFeature({
  user,
  profile,
}: {
  profile: ProfileCreationController;
  user: CurrentUserProfile;
}) {
  const location = useLocation();
  const queryClient = useQueryClient();
  const [cityPickerOpen, setCityPickerOpen] = useState(false);
  const [preferencesSectionBusy, setPreferencesSectionBusy] = useState(false);
  const [interestsSectionBusy, setInterestsSectionBusy] = useState(false);
  const [basicsSectionBusy, setBasicsSectionBusy] = useState(false);
  const {draft, patchDraft, completion} = profile;
  const profileRef = useRef(profile);
  profileRef.current = profile;
  const {percent} = completion;
  const [editorMode, setEditorMode] = useState<"edit" | "view">("edit");
  /** After first “View” open, keep the preview mounted and toggle with CSS so images don’t remount. */
  const [viewPanelMounted, setViewPanelMounted] = useState(false);

  const prefsDebounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const prefsPatchInFlight = useRef(0);
  const interestsDebounceRef = useRef<
    ReturnType<typeof setTimeout> | undefined
  >(undefined);
  const interestsPatchInFlight = useRef(0);
  const basicsDebounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const basicsPatchInFlight = useRef(0);

  const updateCachedUserPreferences = useCallback(
    (prefs: ReturnType<typeof profilePreferencesDraftToUserSlice>) => {
      const key = queryKeys.currentUser;
      queryClient.setQueryData<CurrentUserProfile>(key, (prev) => ({
        ...(prev ?? user),
        preferences: prefs,
      }));
    },
    [queryClient, user]
  );

  const updateCachedUserInterests = useCallback(
    (interests: string[]) => {
      const key = queryKeys.currentUser;
      queryClient.setQueryData<CurrentUserProfile>(key, (prev) => ({
        ...(prev ?? user),
        interests: [...interests],
      }));
    },
    [queryClient, user]
  );

  const updateCachedUserBasicsFromDraft = useCallback(
    (slice: ProfileBasicsDraftSlice) => {
      const key = queryKeys.currentUser;
      const loc = slice.location.trim();
      queryClient.setQueryData<CurrentUserProfile>(key, (prev) => ({
        ...(prev ?? user),
        jobTitle: slice.jobTitle,
        jobTitlePublic: slice.jobTitlePublic,
        companyName: slice.companyName,
        companyNamePublic: slice.companyNamePublic,
        degree: slice.degree,
        degreePublic: slice.degreePublic,
        schoolName: slice.schoolName,
        schoolNamePublic: slice.schoolNamePublic,
        location: loc === "" ? undefined : loc,
        locationPublic: slice.locationPublic,
        hometown: slice.hometown,
        hometownPublic: slice.hometownPublic,
        height: slice.height,
        heightPublic: slice.heightPublic,
      }));
    },
    [queryClient, user]
  );

  const flushPreferencesToServer = useCallback(
    (next: ProfilePreferencesDraft) => {
      if (!shouldPersistProfilePhotosViaApi()) {
        return;
      }
      const prefs = profilePreferencesDraftToUserSlice(next);
      prefsPatchInFlight.current += 1;
      setPreferencesSectionBusy(true);
      void (async () => {
        try {
          const response = await patchUserProfileDetails({preferences: prefs});
          if (response.preferences === undefined) {
            updateCachedUserPreferences(prefs);
          } else {
            const rp = response.preferences;
            updateCachedUserPreferences({
              seeking: [...rp.seeking],
              ageRange: {...rp.ageRange},
              ageRangeStrict: rp.ageRangeStrict === true,
              distanceKm: rp.distanceKm,
              intentions: rp.intentions,
            });
          }
        } catch {
          /* Keep local draft; next fetch will reconcile if needed */
        } finally {
          prefsPatchInFlight.current -= 1;
          if (prefsPatchInFlight.current === 0) {
            setPreferencesSectionBusy(false);
          }
        }
      })();
    },
    [updateCachedUserPreferences]
  );

  const flushInterestsToServer = useCallback(
    (ids: string[]) => {
      if (!shouldPersistProfilePhotosViaApi()) {
        return;
      }
      interestsPatchInFlight.current += 1;
      setInterestsSectionBusy(true);
      void (async () => {
        try {
          const response = await patchUserProfileDetails({interests: ids});
          if (response.interests === undefined) {
            updateCachedUserInterests(ids);
          } else {
            updateCachedUserInterests([...response.interests]);
          }
        } catch {
          /* Keep local draft; next fetch will reconcile if needed */
        } finally {
          interestsPatchInFlight.current -= 1;
          if (interestsPatchInFlight.current === 0) {
            setInterestsSectionBusy(false);
          }
        }
      })();
    },
    [updateCachedUserInterests]
  );

  const flushBasicsToServer = useCallback(
    (next: ProfileBasicsDraftSlice) => {
      if (!shouldPersistProfilePhotosViaApi()) {
        return;
      }
      basicsPatchInFlight.current += 1;
      setBasicsSectionBusy(true);
      void (async () => {
        try {
          await patchUserProfileDetails(profileBasicsDraftToPatchBody(next));
          updateCachedUserBasicsFromDraft(next);
        } catch {
          /* Keep local draft; next fetch will reconcile if needed */
        } finally {
          basicsPatchInFlight.current -= 1;
          if (basicsPatchInFlight.current === 0) {
            setBasicsSectionBusy(false);
          }
        }
      })();
    },
    [updateCachedUserBasicsFromDraft]
  );

  const schedulePreferencesToServer = useCallback(
    (next: ProfilePreferencesDraft) => {
      if (prefsDebounceRef.current !== undefined) {
        clearTimeout(prefsDebounceRef.current);
      }
      prefsDebounceRef.current = setTimeout(() => {
        prefsDebounceRef.current = undefined;
        flushPreferencesToServer(next);
      }, 450);
    },
    [flushPreferencesToServer]
  );

  const scheduleBasicsToServer = useCallback(
    (next: ProfileBasicsDraftSlice) => {
      if (basicsDebounceRef.current !== undefined) {
        clearTimeout(basicsDebounceRef.current);
      }
      basicsDebounceRef.current = setTimeout(() => {
        basicsDebounceRef.current = undefined;
        flushBasicsToServer(next);
      }, 450);
    },
    [flushBasicsToServer]
  );

  useEffect(() => {
    return () => {
      if (prefsDebounceRef.current !== undefined) {
        clearTimeout(prefsDebounceRef.current);
      }
      if (interestsDebounceRef.current !== undefined) {
        clearTimeout(interestsDebounceRef.current);
      }
      if (basicsDebounceRef.current !== undefined) {
        clearTimeout(basicsDebounceRef.current);
      }
    };
  }, []);

  const draftInterestsKey = JSON.stringify(draft.interests);
  const userInterestsKey = JSON.stringify(user.interests ?? []);

  useEffect(() => {
    if (draftInterestsKey === userInterestsKey) {
      return;
    }
    if (!shouldPersistProfilePhotosViaApi()) {
      return;
    }
    const next = [...draft.interests];
    if (interestsDebounceRef.current !== undefined) {
      clearTimeout(interestsDebounceRef.current);
    }
    interestsDebounceRef.current = setTimeout(() => {
      interestsDebounceRef.current = undefined;
      flushInterestsToServer(next);
    }, 450);
    return () => {
      if (interestsDebounceRef.current !== undefined) {
        clearTimeout(interestsDebounceRef.current);
        interestsDebounceRef.current = undefined;
      }
    };
  }, [
    draftInterestsKey,
    userInterestsKey,
    draft.interests,
    flushInterestsToServer,
  ]);

  const onPatchPreferences = useCallback(
    (partial: Partial<ProfilePreferencesDraft>) => {
      const current = profile.draft.preferences;
      const next: ProfilePreferencesDraft = {...current, ...partial};
      profile.patchPreferences(partial);
      schedulePreferencesToServer(next);
    },
    [profile, schedulePreferencesToServer]
  );

  const onToggleSeeking = useCallback(
    (label: string) => {
      const p = profile.draft.preferences;
      const has = p.seeking.includes(label);
      const nextSeeking = has
        ? p.seeking.filter((x) => x !== label)
        : [...p.seeking, label];
      const next: ProfilePreferencesDraft = {
        ...p,
        seeking: nextSeeking,
      };
      profile.patchPreferences({seeking: nextSeeking});
      schedulePreferencesToServer(next);
    },
    [profile, schedulePreferencesToServer]
  );

  const patchBasicsDraftOnly = useCallback(
    (partial: Partial<ProfileBasicsDraftSlice>) => {
      patchDraft(partial);
    },
    [patchDraft]
  );

  const onBasicsSyncToServer = useCallback(
    (partial: Partial<ProfileBasicsDraftSlice>) => {
      const mergedDraft = {...profileRef.current.draft, ...partial};
      const next = pickProfileBasicsDraft(mergedDraft);
      patchDraft(partial);
      scheduleBasicsToServer(next);
    },
    [patchDraft, scheduleBasicsToServer]
  );

  const setPhotos = useCallback(
    async (photos: Photo[]) => {
      const key = queryKeys.currentUser;
      const prevPhotos =
        queryClient.getQueryData<CurrentUserProfile>(key)?.photos ??
        user.photos;
      try {
        if (shouldPersistProfilePhotosViaApi()) {
          const nextIds = new Set(photos.map((p) => p.id));
          for (const p of prevPhotos) {
            if (!nextIds.has(p.id)) {
              await deleteUserPhoto(p.id);
            }
          }
          const persisted = await persistNewDataUrlPhotos(photos);
          queryClient.setQueryData<CurrentUserProfile>(key, (prev) => ({
            ...(prev ?? user),
            photos: persisted,
          }));
        } else {
          queryClient.setQueryData<CurrentUserProfile>(key, (prev) => ({
            ...(prev ?? user),
            photos,
          }));
        }
      } catch {
        /* Network / validation errors — keep prior gallery until user retries */
      }
    },
    [queryClient, user]
  );

  /** Re-run `fetchCurrentUser` so `GET /v1/users/me/profile` repopulates gallery from the server. */
  useEffect(() => {
    if (!shouldPersistProfilePhotosViaApi()) {
      return;
    }
    void queryClient.invalidateQueries({queryKey: queryKeys.currentUser});
  }, [queryClient]);

  useProfileEditHashScroll(location.pathname, location.hash);

  const openCityPicker = useCallback(() => {
    setCityPickerOpen(true);
  }, []);

  const lifestyleSlice = {
    exercise: draft.exercise,
    drinking: draft.drinking,
    smoking: draft.smoking,
    zodiac: draft.zodiac,
    kids: draft.kids,
    haveKids: draft.haveKids,
    politics: draft.politics,
    religion: draft.religion,
    pronouns: draft.pronouns,
    languages: draft.languages,
  };

  return (
    <div className="space-y-app-6">
      <div className="flex w-full max-w-md gap-app-1 border-b border-unora-line/50">
        <button
          type="button"
          onClick={() => {
            setEditorMode("edit");
          }}
          className={cn(
            "flex-1 pb-2.5 text-sm font-medium transition-colors",
            editorMode === "edit"
              ? "border-b-2 border-unora-ink text-unora-ink"
              : "text-unora-mist hover:text-unora-ink/70"
          )}>
          {p.edit.editTab}
        </button>
        <button
          type="button"
          onClick={() => {
            setViewPanelMounted(true);
            setEditorMode("view");
          }}
          className={cn(
            "flex-1 pb-2.5 text-sm font-medium transition-colors",
            editorMode === "view"
              ? "border-b-2 border-unora-ink text-unora-ink"
              : "text-unora-mist hover:text-unora-ink/70"
          )}>
          {p.edit.viewTab}
        </button>
      </div>

      <div
        aria-hidden={editorMode !== "edit"}
        className={cn(
          editorMode === "edit" ? "block" : "hidden",
          "space-y-app-6"
        )}>
        <ProfileCreationCompletionSection percent={percent} />
        <ProfileCreationPhotosSection
          photos={user.photos}
          onPhotosChange={setPhotos}
        />
        <ProfileCreationPreferencesSection
          preferences={draft.preferences}
          busy={preferencesSectionBusy}
          patchPreferences={onPatchPreferences}
          toggleSeeking={onToggleSeeking}
        />
        <ProfileCreationInterestsSection
          busy={interestsSectionBusy}
          interestIds={draft.interests}
        />
        <ProfileCreationVerificationSection user={user} />
        <ProfileCreationBioSection
          bio={draft.bio}
          onBioChange={(bio) => patchDraft({bio})}
        />
        <ProfileCreationBasicsSection
          busy={basicsSectionBusy}
          companyName={draft.companyName}
          companyNamePublic={draft.companyNamePublic}
          degree={draft.degree}
          degreePublic={draft.degreePublic}
          height={draft.height}
          heightPublic={draft.heightPublic}
          hometown={draft.hometown}
          hometownPublic={draft.hometownPublic}
          jobTitle={draft.jobTitle}
          jobTitlePublic={draft.jobTitlePublic}
          location={draft.location}
          locationPublic={draft.locationPublic}
          schoolName={draft.schoolName}
          schoolNamePublic={draft.schoolNamePublic}
          onBasicsDraftPatch={patchBasicsDraftOnly}
          onBasicsSyncToServer={onBasicsSyncToServer}
          onOpenCityPicker={openCityPicker}
        />
        <ProfileCreationLifestyleSection
          draftSlice={lifestyleSlice}
          onPatch={patchDraft}
        />
        <ProfileCreationConversationStarterSection
          promptAnswer={draft.promptAnswer}
          onPromptAnswerChange={(promptAnswer) => patchDraft({promptAnswer})}
        />
        <ProfileCreationAlignmentSection
          alignmentBullets={draft.alignmentBullets}
          onPatch={(alignmentBullets) => patchDraft({alignmentBullets})}
        />

        <CityLocationPicker
          open={cityPickerOpen}
          onClose={() => setCityPickerOpen(false)}
          onSelect={(location) => onBasicsSyncToServer({location})}
        />
      </div>

      {viewPanelMounted ? (
        <div
          aria-hidden={editorMode !== "view"}
          className={editorMode === "view" ? "block" : "hidden"}>
          <ProfileEditorPreviewView draft={draft} user={user} />
        </div>
      ) : null}
    </div>
  );
}
