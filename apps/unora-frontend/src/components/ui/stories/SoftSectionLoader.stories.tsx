import type {Meta, StoryObj} from "@storybook/react-vite";

import {SoftSectionLoader} from "@/components/ui/SoftSectionLoader";

const meta = {
  title: "Components/UI/SoftSectionLoader",
  component: SoftSectionLoader,
  tags: ["autodocs"],
} satisfies Meta<typeof SoftSectionLoader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="max-w-md space-y-3 rounded-2xl border border-unora-line/60 bg-white p-app-4">
      <p className="text-sm text-unora-mist">
        Thin indeterminate line — use with an ancestor that sets{" "}
        <code className="text-unora-ink">aria-busy</code> (see Section).
      </p>
      <SoftSectionLoader />
    </div>
  ),
};
