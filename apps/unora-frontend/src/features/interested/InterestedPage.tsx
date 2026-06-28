import {useMemo, useState} from "react";

import {HandHeart, Heart, HeartHandshake} from "lucide-react";

import {EmptyState, ScreenSkeleton} from "@/components/ui";
import {profileCreationSectionDividerClass} from "@/features/profile/sectionDivider";
import {useInterestedList} from "@/hooks/useInterestedList";
import type {InterestedPerson} from "@/types";

import {strings} from "../strings";
import {
  InterestedEmptyIcon,
  InterestedListFooter,
  InterestedMatchSection,
  InterestedMatchesHeader,
  InterestedPersonCard,
} from "./components";

type SortMode = "recent" | "nameAsc" | "nameDesc";

function sortInterested(
  list: readonly InterestedPerson[],
  mode: SortMode
): InterestedPerson[] {
  const next = [...list];
  if (mode === "nameAsc") {
    next.sort((a, b) => a.displayName.localeCompare(b.displayName));
  } else if (mode === "nameDesc") {
    next.sort((a, b) => b.displayName.localeCompare(a.displayName));
  } else {
    next.sort(
      (a, b) =>
        new Date(b.matchedAt).getTime() - new Date(a.matchedAt).getTime()
    );
  }
  return next;
}

function partitionByMatchKind(list: readonly InterestedPerson[]) {
  const mutualMatch: InterestedPerson[] = [];
  const likedYou: InterestedPerson[] = [];
  for (const p of list) {
    if (p.status === "ready_to_connect") {
      mutualMatch.push(p);
    } else {
      likedYou.push(p);
    }
  }
  return {mutualMatch, likedYou};
}

export default function InterestedPage() {
  const interested = useInterestedList();
  const i = strings.interested;
  const [sortMode, setSortMode] = useState<SortMode>("recent");

  const sortedList = useMemo(() => {
    const raw = interested.data ?? [];
    return sortInterested(raw, sortMode);
  }, [interested.data, sortMode]);

  const {mutualMatch, likedYou} = useMemo(
    () => partitionByMatchKind(sortedList),
    [sortedList]
  );

  const cycleSort = () => {
    setSortMode((m) =>
      m === "recent" ? "nameAsc" : m === "nameAsc" ? "nameDesc" : "recent"
    );
  };

  if (interested.isLoading) {
    return <ScreenSkeleton variant="list" />;
  }

  const list = interested.data ?? [];
  const sortActive = sortMode !== "recent";

  const matchGrid = (people: readonly InterestedPerson[]) => (
    <ul className="grid grid-cols-2 gap-x-app-3 gap-y-app-4">
      {people.map((person) => (
        <li key={person.id} className="min-w-0">
          <InterestedPersonCard person={person} />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="space-y-app-5 py-app-2">
      <InterestedMatchesHeader
        title={i.title}
        titleIcon={Heart}
        subtitle={i.subtitle}
        sortAriaLabel={i.sortAria}
        onSortClick={cycleSort}
        sortDisabled={list.length === 0}
        sortActive={sortActive}
      />

      {list.length === 0 ? (
        <EmptyState
          className="min-h-[52vh]"
          icon={<InterestedEmptyIcon />}
          title={i.empty.title}
          description={i.empty.description}
          footnote={i.empty.footnote}
        />
      ) : (
        <>
          <div className="space-y-app-6">
            {mutualMatch.length > 0 ? (
              <InterestedMatchSection
                className={profileCreationSectionDividerClass}
                title={i.sections.mutualMatch}
                titleIcon={HeartHandshake}
                description={i.sections.mutualMatchDescription}>
                {matchGrid(mutualMatch)}
              </InterestedMatchSection>
            ) : null}
            {likedYou.length > 0 ? (
              <InterestedMatchSection
                className={profileCreationSectionDividerClass}
                title={i.sections.likedYou}
                titleIcon={HandHeart}
                description={i.sections.likedYouDescription}>
                {matchGrid(likedYou)}
              </InterestedMatchSection>
            ) : null}
          </div>
          <InterestedListFooter>{i.paginationFooter}</InterestedListFooter>
        </>
      )}
    </div>
  );
}
