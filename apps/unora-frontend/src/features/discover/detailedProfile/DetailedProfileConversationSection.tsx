import {strings} from "../../strings";
import {DetailedProfileEmphasisCard} from "./DetailedProfileEmphasisCard";
import {DETAILED_PROFILE_SECTION_IDS} from "./detailedProfileAnchors";

const pc = strings.profile.profileCreation;
const s = strings.discover.detailedProfile;

export function DetailedProfileConversationSection({
  promptAnswer,
}: {
  promptAnswer: string;
}) {
  const text = promptAnswer.trim();
  if (!text) {
    return null;
  }

  return (
    <DetailedProfileEmphasisCard
      id={DETAILED_PROFILE_SECTION_IDS.conversation}
      showTopDivider
      title={pc.prompt.title}
      kicker={pc.prompt.label}
      body={text}
      commentCta={s.emphasisCommentCta}
      commentAriaLabel={s.emphasisCommentAria}
    />
  );
}
