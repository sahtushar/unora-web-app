import type {Meta, StoryObj} from "@storybook/react-vite";

import {Badge} from "@/components/ui/Badge";

const meta = {
  title: "Components/UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: {children: "New"},
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {args: {tone: "neutral"}};

export const Accent: Story = {args: {tone: "accent", children: "Curated"}};

export const Success: Story = {args: {tone: "success", children: "Verified"}};

export const Ink: Story = {args: {tone: "ink", children: "Pro"}};

export const Row: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge tone="neutral">Neutral</Badge>
      <Badge tone="accent">Accent</Badge>
      <Badge tone="success">Success</Badge>
      <Badge tone="ink">Ink</Badge>
    </div>
  ),
};
