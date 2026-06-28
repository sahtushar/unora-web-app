import type {Meta, StoryObj} from "@storybook/react-vite";

import {LazyImage} from "@/components/ui/LazyImage";

const meta = {
  title: "Components/UI/LazyImage",
  component: LazyImage,
  tags: ["autodocs"],
} satisfies Meta<typeof LazyImage>;

export default meta;
type Story = StoryObj<typeof meta>;

const demoSrc = "https://picsum.photos/seed/unora-lazy/800/600";

/** Tiny grey JPEG as LQIP-style placeholder */
const blurDataUrl =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=";

export const Default: Story = {
  render: () => (
    <div className="h-56 w-full max-w-md overflow-hidden rounded-2xl border border-unora-line/70 shadow-soft">
      <LazyImage
        src={demoSrc}
        alt="Soft abstract texture"
        className="h-full w-full"
      />
    </div>
  ),
};

export const WithBlurPlaceholder: Story = {
  render: () => (
    <div className="h-56 w-full max-w-md overflow-hidden rounded-2xl border border-unora-line/70 shadow-soft">
      <LazyImage
        src={demoSrc}
        alt="Portrait crop"
        blurDataUrl={blurDataUrl}
        className="h-full w-full"
      />
    </div>
  ),
};
