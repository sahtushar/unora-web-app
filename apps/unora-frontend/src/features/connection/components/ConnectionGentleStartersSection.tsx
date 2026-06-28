import {Sparkles} from "lucide-react";

import {Section} from "@/components/ui";

import {ConnectionPromptChip} from "./ConnectionPromptChip";

export function ConnectionGentleStartersSection({
  title,
  description,
  prompts,
  onSelectPrompt,
  promptsDisabled = true,
  className,
}: {
  description: string;
  prompts: readonly string[];
  title: string;
  className?: string;
  promptsDisabled?: boolean;
  onSelectPrompt?: (text: string) => void;
}) {
  return (
    <Section
      className={className}
      titleIcon={Sparkles}
      title={title}
      description={description}>
      <div className="flex flex-wrap gap-app-2">
        {prompts.map((text) => (
          <ConnectionPromptChip
            key={text}
            disabled={promptsDisabled}
            onClick={() => {
              onSelectPrompt?.(text);
            }}>
            {text}
          </ConnectionPromptChip>
        ))}
      </div>
    </Section>
  );
}
