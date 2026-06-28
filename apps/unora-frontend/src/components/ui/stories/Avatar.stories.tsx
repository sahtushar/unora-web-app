import type {Meta, StoryObj} from "@storybook/react-vite";

import {Avatar} from "@/components/ui/Avatar";

const meta = {
  title: "Components/UI/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  args: {
    alt: "Alex Rivera",
    fallback: "AR",
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithPhoto: Story = {
  args: {
    src: "https://picsum.photos/seed/unora-avatar/256/256",
    size: "md",
  },
};

export const InitialsOnly: Story = {
  args: {src: null, size: "md"},
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-app-4">
      <Avatar
        src="https://picsum.photos/seed/s1/128/128"
        alt="Small"
        size="sm"
      />
      <Avatar
        src="https://picsum.photos/seed/m1/128/128"
        alt="Medium"
        size="md"
      />
      <Avatar
        src="https://picsum.photos/seed/l1/128/128"
        alt="Large"
        size="lg"
      />
      <Avatar
        src="https://picsum.photos/seed/x1/128/128"
        alt="Extra large"
        size="xl"
      />
    </div>
  ),
};
