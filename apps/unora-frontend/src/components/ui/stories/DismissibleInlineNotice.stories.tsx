import type {Meta, StoryObj} from "@storybook/react-vite";

import {DismissibleInlineNotice} from "@/components/ui/DismissibleInlineNotice";

const meta = {
  title: "Components/UI/DismissibleInlineNotice",
  component: DismissibleInlineNotice,
  tags: ["autodocs"],
  args: {
    title: "Heads up",
    description:
      "Short supporting copy for something time-sensitive or contextual.",
    dismissLabel: "Dismiss",
    onDismiss: () => {},
    emphasizeOnMount: true,
  },
} satisfies Meta<typeof DismissibleInlineNotice>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoEmphasis: Story = {
  args: {emphasizeOnMount: false},
};
