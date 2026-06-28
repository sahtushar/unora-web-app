import type {Meta, StoryObj} from "@storybook/react-vite";

import {
  ScreenSkeleton,
  type ScreenSkeletonVariant,
} from "@/components/ui/ScreenSkeleton";

const variants: ScreenSkeletonVariant[] = [
  "discover",
  "connection",
  "list",
  "profile",
];

const meta = {
  title: "Components/UI/ScreenSkeleton",
  component: ScreenSkeleton,
  tags: ["autodocs"],
} satisfies Meta<typeof ScreenSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Discover: Story = {
  args: {variant: "discover"},
  render: (args) => (
    <div className="max-w-app">
      <ScreenSkeleton variant={args.variant} />
    </div>
  ),
};

export const AllVariants: Story = {
  args: {variant: "discover"},
  render: () => (
    <div className="grid gap-app-8 md:grid-cols-2">
      {variants.map((variant) => (
        <div key={variant}>
          <p className="mb-app-2 font-mono text-xs text-unora-mist">
            {variant}
          </p>
          <div className="max-w-app rounded-2xl border border-unora-line/60 bg-unora-snow/80 p-app-3">
            <ScreenSkeleton variant={variant} />
          </div>
        </div>
      ))}
    </div>
  ),
};
