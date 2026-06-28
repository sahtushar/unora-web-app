import type {Meta, StoryObj} from "@storybook/react-vite";

import {BottomNav} from "@/components/ui/BottomNav";

const meta = {
  title: "Components/UI/BottomNav",
  component: BottomNav,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof BottomNav>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Fixed bar — preview uses a tall canvas so it sits toward the bottom. */
export const Default: Story = {
  render: () => (
    <div className="relative mx-auto min-h-[70dvh] max-w-app">
      <p className="text-sm text-unora-mist">
        Uses <code className="text-unora-ink">NavLink</code> against{" "}
        <code className="text-unora-ink">MemoryRouter</code> in Storybook
        preview (initial route: <code className="text-unora-ink">/</code>).
      </p>
      <BottomNav />
    </div>
  ),
};
