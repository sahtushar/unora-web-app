import {Gauge} from "lucide-react";

import {Card, Section} from "@/components/ui";
import {cn} from "@/lib/cn";

import {strings} from "../../strings";
import {PROFILE_CREATION_SECTION_IDS} from "../profileAnchors";
import {profileCreationSectionDividerClass} from "./ProfileCreationFields";

const pc = strings.profile.profileCreation;

/** Traffic-light tiers for completion: red → orange → green. */
function completionVisualTier(value: number): {
  digit: string;
  progressValue: string;
  suffix: string;
} {
  if (value >= 80) {
    return {
      digit: "text-emerald-700",
      suffix: "text-emerald-600/90",
      progressValue:
        "[&::-webkit-progress-value]:from-emerald-500 [&::-webkit-progress-value]:to-green-800 [&::-moz-progress-bar]:bg-emerald-600",
    };
  }
  if (value >= 40) {
    return {
      digit: "text-orange-600",
      suffix: "text-orange-500/90",
      progressValue:
        "[&::-webkit-progress-value]:from-amber-500 [&::-webkit-progress-value]:to-orange-700 [&::-moz-progress-bar]:bg-orange-500",
    };
  }
  return {
    digit: "text-red-700",
    suffix: "text-red-600/90",
    progressValue:
      "[&::-webkit-progress-value]:from-rose-500 [&::-webkit-progress-value]:to-red-700 [&::-moz-progress-bar]:bg-red-600",
  };
}

export function ProfileCreationCompletionSection({percent}: {percent: number}) {
  const tone = completionVisualTier(percent);

  return (
    <Section
      id={PROFILE_CREATION_SECTION_IDS.completion}
      className={profileCreationSectionDividerClass}
      titleIcon={Gauge}
      description={pc.completion.almostThere}>
      <Card
        padded={false}
        className="border-unora-line/55 bg-white px-app-3 py-2 shadow-none backdrop-blur-0">
        <div className="flex items-center gap-app-2">
          <p
            className={cn(
              "shrink-0 font-display text-sm font-semibold tabular-nums tracking-tight",
              tone.digit
            )}
            aria-hidden>
            {percent}
            <span className={cn("text-[0.65rem] font-medium", tone.suffix)}>
              %
            </span>
          </p>
          <progress
            value={percent}
            max={100}
            aria-label={pc.completion.progressAriaLabel}
            className={cn(
              "h-1.5 min-w-0 flex-1 appearance-none border-0",
              "[&::-webkit-progress-bar]:h-1.5 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-unora-cloud",
              "[&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-gradient-to-r",
              tone.progressValue
            )}
          />
        </div>
      </Card>
    </Section>
  );
}
