import {getCatalogInterest} from "../profile/interestCatalog";
import {strings} from "../strings";

const interestLabels = strings.profile.profileCreation.interestLabels;

export type DiscoverInterestChip = {
  /** Emoji from catalog, or a neutral marker for legacy ids not in the catalog */
  icon: string;
  id: string;
  label: string;
};

/** Label + icon for each id — matches `ProfileCreationInterestsSection` / interest picker. */
export function interestIdsToInterestChips(
  ids: readonly string[]
): DiscoverInterestChip[] {
  const map = interestLabels as Record<string, string>;
  return ids.map((id) => {
    const fromCatalog = getCatalogInterest(id);
    const label = fromCatalog?.label ?? map[id] ?? id;
    const icon = fromCatalog?.icon ?? "✦";
    return {id, label, icon};
  });
}

/** Text-only labels for compact surfaces (e.g. card overlay). */
export function interestIdsToDisplayLabels(ids: readonly string[]): string[] {
  return interestIdsToInterestChips(ids).map((c) => c.label);
}
