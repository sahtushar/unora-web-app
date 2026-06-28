import type {Meta, StoryObj} from "@storybook/react-vite";

import {Button} from "@/components/ui/Button";
import {Card} from "@/components/ui/Card";

const meta = {
  title: "Components/UI/Card",
  component: Card,
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="max-w-md">
      <p className="text-sm text-unora-mist">
        Cards use a soft border, light blur, and theme-aware surface tokens.
      </p>
      <div className="mt-app-4">
        <Button size="sm">Action</Button>
      </div>
    </Card>
  ),
};

export const NotPadded: Story = {
  render: () => (
    <Card padded={false} className="max-w-md overflow-hidden">
      <div className="bg-unora-cloud/60 px-app-4 py-app-3 text-sm font-medium text-unora-ink">
        Header strip
      </div>
      <p className="p-app-4 text-sm text-unora-mist">
        Content area manages its own padding when{" "}
        <code className="text-unora-ink">padded=false</code>.
      </p>
    </Card>
  ),
};
