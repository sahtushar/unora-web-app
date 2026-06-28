import type {Meta, StoryObj} from "@storybook/react-vite";
import {Inbox} from "lucide-react";

import {Button} from "@/components/ui/Button";
import {EmptyState} from "@/components/ui/EmptyState";

const meta = {
  title: "Components/UI/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Nothing here yet",
    description:
      "When a list is empty, this surface keeps the tone warm and actionable.",
    icon: <Inbox className="h-7 w-7" strokeWidth={1.5} aria-hidden />,
  },
};

export const WithActions: Story = {
  args: {
    title: "No messages",
    description: "Start a conversation when you are ready — no pressure.",
    icon: <Inbox className="h-7 w-7" strokeWidth={1.5} aria-hidden />,
    actions: (
      <>
        <Button variant="primary">Browse discover</Button>
        <Button variant="secondary">Learn more</Button>
      </>
    ),
    footnote: "You can change notification preferences anytime in settings.",
  },
};
