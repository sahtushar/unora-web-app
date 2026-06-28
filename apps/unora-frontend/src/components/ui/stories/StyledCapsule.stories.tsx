import type {Meta, StoryObj} from "@storybook/react-vite";
import {Check} from "lucide-react";

import {StyledCapsule} from "@/components/ui/StyledCapsule";
import type {StyledCapsuleCombo} from "@/components/ui/styledCapsulePresets";

const combos: StyledCapsuleCombo[] = [
  "heroOnPhoto",
  "cloudInk",
  "blushBrand",
  "snowMuted",
  "brandSnow",
];

const meta = {
  title: "Components/UI/StyledCapsule",
  component: StyledCapsule,
  tags: ["autodocs"],
} satisfies Meta<typeof StyledCapsule>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Presets: Story = {
  args: {
    combo: "cloudInk",
    children: "—",
  },
  render: () => (
    <div className="flex flex-col gap-app-3">
      {combos.map((combo) => (
        <div key={combo} className="flex items-center gap-app-3">
          <code className="w-32 shrink-0 text-xs text-unora-mist">{combo}</code>
          <StyledCapsule combo={combo}>
            <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
            <span>Label</span>
          </StyledCapsule>
        </div>
      ))}
    </div>
  ),
};

export const OnDarkStrip: Story = {
  args: {
    combo: "heroOnPhoto",
    children: <span>Verified</span>,
  },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-br from-unora-ink to-unora-ink/80 p-app-6">
      <StyledCapsule combo={args.combo}>{args.children}</StyledCapsule>
    </div>
  ),
};
