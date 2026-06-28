import {strings} from "../../strings";
import {DetailedProfileEmphasisCard} from "./DetailedProfileEmphasisCard";
import {DETAILED_PROFILE_SECTION_IDS} from "./detailedProfileAnchors";

const s = strings.discover.detailedProfile;

export function DetailedProfileAboutSection({bio}: {bio: string}) {
  const text = bio.trim();
  if (!text) {
    return null;
  }

  return (
    <DetailedProfileEmphasisCard
      id={DETAILED_PROFILE_SECTION_IDS.about}
      title={s.aboutTitle}
      body={text}
      commentCta={s.emphasisCommentCta}
      commentAriaLabel={s.emphasisCommentAria}
    />
  );
}
