import type {Meta, StoryObj} from "@storybook/react-vite";

import {UnoraMarkIcon} from "@/components/icons/UnoraMarkIcon";

const meta = {
  title: "Components/Icons/UnoraMarkIcon",
  component: UnoraMarkIcon,
  tags: ["autodocs"],
} satisfies Meta<typeof UnoraMarkIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-app-6">
      <UnoraMarkIcon
        className="h-10 w-10 text-unora-brand-strong"
        aria-hidden
      />
      <UnoraMarkIcon className="h-10 w-10 text-unora-ink" aria-hidden />
      <UnoraMarkIcon className="h-10 w-10 text-white" aria-hidden />
    </div>
  ),
};

export const WithTitle: Story = {
  render: () => (
    <UnoraMarkIcon
      className="h-12 w-12 text-unora-brand-strong"
      title="Unora"
    />
  ),
};
