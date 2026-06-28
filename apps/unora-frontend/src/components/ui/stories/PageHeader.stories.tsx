import type {Meta, StoryObj} from "@storybook/react-vite";

import {Button} from "@/components/ui/Button";
import {PageHeader} from "@/components/ui/PageHeader";

const meta = {
  title: "Components/UI/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TitleOnly: Story = {
  args: {title: "Discover"},
};

export const WithSubtitle: Story = {
  args: {
    title: "Profile",
    subtitle: "A calm surface for the details that matter.",
  },
};

export const WithTrailing: Story = {
  args: {
    title: "Interested",
    subtitle: "People who said yes — at your pace.",
    trailing: (
      <Button size="sm" variant="secondary">
        Edit
      </Button>
    ),
  },
};
