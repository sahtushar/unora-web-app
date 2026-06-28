import type {Meta, StoryObj} from "@storybook/react-vite";

import {Skeleton} from "@/components/ui/Skeleton";

const meta = {
  title: "Components/UI/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Line: Story = {
  render: () => <Skeleton className="h-4 w-full max-w-xs" />,
};

export const CardBlock: Story = {
  render: () => <Skeleton className="h-32 w-full max-w-md rounded-2xl" />,
};

export const Row: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-app-2">
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  ),
};
