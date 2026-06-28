import {memo} from "react";

import type {DiscoverProfile} from "@/types";

import {SimilarInterestProfileCard} from "./SimilarInterestProfileCard";

export interface SimilarInterestsStripProps {
  profiles: DiscoverProfile[];
  onSelectProfile: (profile: DiscoverProfile) => void;
}

export const SimilarInterestsStrip = memo(function SimilarInterestsStrip({
  profiles,
  onSelectProfile,
}: SimilarInterestsStripProps) {
  if (profiles.length === 0) {
    return null;
  }

  return (
    <div className="-mx-app-1">
      <div className="flex gap-app-3 overflow-x-auto pb-app-2 pt-app-1 scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {profiles.map((p) => (
          <SimilarInterestProfileCard
            key={p.id}
            profile={p}
            onSelect={onSelectProfile}
          />
        ))}
      </div>
    </div>
  );
});
