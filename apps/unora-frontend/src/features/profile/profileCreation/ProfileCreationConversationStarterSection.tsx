import {MessageSquare} from "lucide-react";

import {Card, Section} from "@/components/ui";
import {cn} from "@/lib/cn";

import {strings} from "../../strings";
import {PROFILE_CREATION_SECTION_IDS} from "../profileAnchors";
import {
  profileCreationFieldInputClass,
  profileCreationSectionDividerClass,
} from "./ProfileCreationFields";

const pc = strings.profile.profileCreation;

export function ProfileCreationConversationStarterSection({
  promptAnswer,
  onPromptAnswerChange,
}: {
  promptAnswer: string;
  onPromptAnswerChange: (value: string) => void;
}) {
  return (
    <Section
      collapsible
      id={PROFILE_CREATION_SECTION_IDS.conversationStarter}
      className={profileCreationSectionDividerClass}
      titleIcon={MessageSquare}
      title={pc.prompt.title}
      description={pc.prompt.hint}>
      <Card className="border-unora-line/90 space-y-app-3">
        <p className="text-sm font-semibold text-unora-ink">
          {pc.prompt.label}
        </p>
        <textarea
          value={promptAnswer}
          onChange={(e) => onPromptAnswerChange(e.target.value)}
          rows={3}
          placeholder={pc.prompt.placeholder}
          className={cn(
            profileCreationFieldInputClass,
            "min-h-[5.5rem] resize-y leading-relaxed"
          )}
        />
      </Card>
    </Section>
  );
}
