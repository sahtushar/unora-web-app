import type {Meta, StoryObj} from "@storybook/react-vite";
import {X} from "lucide-react";

import {Button} from "@/components/ui/Button";

const meta = {
  title: "Components/UI/Button",
  component: Button,
  tags: ["autodocs"],
  args: {children: "Continue"},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {args: {variant: "primary"}};

export const Secondary: Story = {args: {variant: "secondary"}};

export const Ghost: Story = {args: {variant: "ghost"}};

export const Danger: Story = {args: {variant: "danger"}};

export const Google: Story = {args: {variant: "google"}};

export const OutlineInk: Story = {args: {variant: "outlineInk"}};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-app-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="Close">
        <X className="h-5 w-5" strokeWidth={2} aria-hidden />
      </Button>
    </div>
  ),
};

export const Pill: Story = {
  render: () => (
    <div className="max-w-sm">
      <Button variant="primary" size="pill">
        Sign in with email
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: {disabled: true, children: "Unavailable"},
};
