import {strings} from "../../strings";
import {DetailedProfileEmphasisCard} from "./DetailedProfileEmphasisCard";
import {DETAILED_PROFILE_SECTION_IDS} from "./detailedProfileAnchors";

const s = strings.discover.detailedProfile;

export function DetailedProfileHighlightSection({
  headline,
}: {
  headline: string;
}) {
  const text = headline.trim();
  if (!text) {
    return null;
  }

  return (
    <DetailedProfileEmphasisCard
      id={DETAILED_PROFILE_SECTION_IDS.highlight}
      showTopDivider
      title={s.highlightTitle}
      body={text}
      commentCta={s.emphasisCommentCta}
      commentAriaLabel={s.emphasisCommentAria}
    />
  );
}
