import {createElement} from "react";

import type {Meta, StoryObj} from "@storybook/react-vite";

import {AppBrandHeader} from "@/components/ui/AppBrandHeader";

const meta = {
  title: "Components/UI/AppBrandHeader",
  component: AppBrandHeader,
  tags: ["autodocs"],
} satisfies Meta<typeof AppBrandHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => createElement(AppBrandHeader),
};

export const OnCanvas: Story = {
  render: () =>
    createElement(
      "div",
      {
        className:
          "overflow-hidden rounded-2xl border border-unora-line/70 bg-unora-snow/95 shadow-soft",
      },
      createElement(AppBrandHeader)
    ),
};
