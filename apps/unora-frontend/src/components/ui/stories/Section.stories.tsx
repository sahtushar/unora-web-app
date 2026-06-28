import type {Meta, StoryObj} from "@storybook/react-vite";
import {Heart, Shield} from "lucide-react";

import {Button} from "@/components/ui/Button";
import {Section} from "@/components/ui/Section";

const meta = {
  title: "Components/UI/Section",
  component: Section,
  tags: ["autodocs"],
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TitleOnly: Story = {
  args: {
    title: "Basics",
    children: (
      <p className="text-sm text-unora-mist">
        Section body copy uses relaxed leading for readability.
      </p>
    ),
  },
};

export const WithIconAndDescription: Story = {
  args: {
    title: "Interested",
    titleIcon: Heart,
    description: "A short line of supporting context under the heading.",
    children: <p className="text-sm text-unora-ink">Content area.</p>,
  },
};

export const WithAction: Story = {
  args: {
    title: "Photos",
    description: "Up to six images, shown in the order visitors swipe.",
    action: (
      <Button size="sm" variant="ghost">
        Reorder
      </Button>
    ),
    children: (
      <div className="rounded-2xl border border-dashed border-unora-line/80 p-app-6 text-center text-sm text-unora-mist">
        Photo grid placeholder
      </div>
    ),
  },
};

export const CollapsibleDefaultClosed: Story = {
  args: {
    collapsible: true,
    title: "Basics",
    titleIcon: Heart,
    description: "Expand to edit fields; content stays mounted when collapsed.",
    children: (
      <p className="text-sm text-unora-ink">
        Panel body (inputs would keep their values while hidden).
      </p>
    ),
  },
};

export const CollapsibleWithAction: Story = {
  args: {
    collapsible: true,
    title: "Verification",
    titleIcon: Shield,
    description:
      "Optional trailing action stays outside the disclosure control.",
    action: (
      <Button size="sm" variant="secondary">
        Manage
      </Button>
    ),
    children: (
      <div className="rounded-2xl border border-dashed border-unora-line/80 p-app-4 text-sm text-unora-mist">
        Verification tiles
      </div>
    ),
  },
};

export const CollapsibleInitiallyOpen: Story = {
  args: {
    collapsible: true,
    defaultOpen: true,
    title: "Preferences",
    description: "Use defaultOpen when a section should start expanded.",
    children: <p className="text-sm text-unora-ink">Visible on load.</p>,
  },
};

export const CollapsibleBusy: Story = {
  args: {
    collapsible: true,
    defaultOpen: true,
    busy: true,
    title: "Preferences",
    description:
      "Set busy while a save request is in flight; parent gets aria-busy.",
    children: <p className="text-sm text-unora-ink">Form content.</p>,
  },
};
