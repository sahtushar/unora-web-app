import {useCallback, useEffect, useMemo, useState} from "react";

import type {CurrentUserProfile} from "@/types";

import {
  type ProfileCreationDraft,
  type ProfilePreferencesDraft,
  buildDraftFromUser,
  computeProfileCreationCompletion,
  normalizeAlignmentTriple,
} from "./profileCreationModel";

export type ProfileCreationController = ReturnType<typeof useProfileCreation>;

export function useProfileCreation(user: CurrentUserProfile) {
  const [draft, setDraft] = useState<ProfileCreationDraft>(() =>
    buildDraftFromUser(user)
  );

  useEffect(() => {
    setDraft(buildDraftFromUser(user));
  }, [user.id]);

  const serverPreferencesKey = useMemo(
    () => JSON.stringify(user.preferences),
    [user.preferences]
  );

  const serverInterestsKey = useMemo(
    () => JSON.stringify(user.interests ?? []),
    [user.interests]
  );

  const serverBasicsKey = useMemo(
    () =>
      JSON.stringify({
        jobTitle: user.jobTitle ?? "",
        jobTitlePublic: user.jobTitlePublic !== false,
        companyName: user.companyName ?? "",
        companyNamePublic: user.companyNamePublic !== false,
        degree: user.degree ?? "",
        degreePublic: user.degreePublic !== false,
        schoolName: user.schoolName ?? "",
        schoolNamePublic: user.schoolNamePublic !== false,
        location: user.location ?? "",
        locationPublic: user.locationPublic !== false,
        hometown: user.hometown ?? "",
        hometownPublic: user.hometownPublic !== false,
        height: user.height ?? "",
        heightPublic: user.heightPublic !== false,
      }),
    [
      user.jobTitle,
      user.jobTitlePublic,
      user.companyName,
      user.companyNamePublic,
      user.degree,
      user.degreePublic,
      user.schoolName,
      user.schoolNamePublic,
      user.location,
      user.locationPublic,
      user.hometown,
      user.hometownPublic,
      user.height,
      user.heightPublic,
    ]
  );

  /** Re-sync the Preferences card when the server `user.preferences` payload actually changes. */
  useEffect(() => {
    setDraft((d) => ({
      ...d,
      preferences: {
        seeking: [...user.preferences.seeking],
        ageMin: user.preferences.ageRange.min,
        ageMax: user.preferences.ageRange.max,
        ageRangeStrict: user.preferences.ageRangeStrict ?? false,
        distanceKm: user.preferences.distanceKm,
        intentions: user.preferences.intentions,
      },
    }));
    // Only `serverPreferencesKey` — not `user` (new object each query) or we overwrite on every refetch.
    // `user` here is from the render where `user.preferences` last changed the key.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- see above
  }, [serverPreferencesKey]);

  /** Re-sync interests from `GET` / successful PATCH when the server payload changes. */
  useEffect(() => {
    setDraft((d) => ({
      ...d,
      interests: [...(user.interests ?? [])],
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- same pattern as preferences
  }, [serverInterestsKey]);

  /** Re-sync Basics fields when `user` basics from profile API change. */
  useEffect(() => {
    setDraft((d) => ({
      ...d,
      jobTitle: user.jobTitle ?? "",
      jobTitlePublic: user.jobTitlePublic !== false,
      companyName: user.companyName ?? "",
      companyNamePublic: user.companyNamePublic !== false,
      degree: user.degree ?? "",
      degreePublic: user.degreePublic !== false,
      schoolName: user.schoolName ?? "",
      schoolNamePublic: user.schoolNamePublic !== false,
      location: user.location ?? "",
      locationPublic: user.locationPublic !== false,
      hometown: user.hometown ?? "",
      hometownPublic: user.hometownPublic !== false,
      height: user.height ?? "",
      heightPublic: user.heightPublic !== false,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- same pattern as preferences
  }, [serverBasicsKey]);

  const completion = useMemo(
    () =>
      computeProfileCreationCompletion(draft, {
        photoCount: user.photos.length,
        verification: user.verification,
      }),
    [draft, user.photos.length, user.verification]
  );

  const patchDraft = useCallback((partial: Partial<ProfileCreationDraft>) => {
    setDraft((d) => {
      const next: ProfileCreationDraft = {...d, ...partial};
      if (partial.alignmentBullets !== undefined) {
        next.alignmentBullets = normalizeAlignmentTriple(
          partial.alignmentBullets
        );
      }
      return next;
    });
  }, []);

  const toggleInterest = useCallback((id: string) => {
    setDraft((d) => {
      const has = d.interests.includes(id);
      const interests = has
        ? d.interests.filter((x) => x !== id)
        : [...d.interests, id];
      return {...d, interests};
    });
  }, []);

  const patchPreferences = useCallback(
    (partial: Partial<ProfilePreferencesDraft>) => {
      setDraft((d) => ({
        ...d,
        preferences: {...d.preferences, ...partial},
      }));
    },
    []
  );

  const toggleSeeking = useCallback((label: string) => {
    setDraft((d) => {
      const seeking = d.preferences.seeking;
      const has = seeking.includes(label);
      const next = has
        ? seeking.filter((x) => x !== label)
        : [...seeking, label];
      return {
        ...d,
        preferences: {...d.preferences, seeking: next},
      };
    });
  }, []);

  return {
    draft,
    setDraft,
    patchDraft,
    patchPreferences,
    toggleInterest,
    toggleSeeking,
    completion,
  };
}
