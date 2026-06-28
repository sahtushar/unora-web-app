import type {Meta, StoryObj} from "@storybook/react-vite";
import {Globe, ListChecks, MapPin} from "lucide-react";

import {MetadataChip} from "@/components/ui/MetadataChip";

const meta = {
  title: "Components/UI/MetadataChip",
  component: MetadataChip,
  tags: ["autodocs"],
  args: {
    label: "Coffee",
    icon: "☕",
    variant: "surface" as const,
  },
} satisfies Meta<typeof MetadataChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SurfaceEmoji: Story = {};

export const SurfaceLucide: Story = {
  args: {
    label: "Portland",
    icon: (
      <MapPin className="h-3.5 w-3.5 text-unora-ink/70" strokeWidth={1.75} />
    ),
  },
};

export const OverlayRow: Story = {
  render: () => (
    <div className="rounded-2xl bg-gradient-to-t from-black/80 to-unora-cloud p-6">
      <div className="flex flex-wrap gap-2">
        <MetadataChip variant="overlay" icon="☕" label="Coffee" />
        <MetadataChip variant="overlay" icon="✨" label="Therapy" />
        <MetadataChip
          variant="overlay"
          icon={<Globe className="h-3.5 w-3.5" strokeWidth={1.75} />}
          label="English, Spanish"
        />
      </div>
    </div>
  ),
};

export const SurfaceRow: Story = {
  render: () => {
    const globeIcon = (
      <Globe className="h-3.5 w-3.5 text-unora-ink/70" strokeWidth={1.75} />
    );
    const listChecksIcon = (
      <ListChecks
        className="h-3.5 w-3.5 text-unora-ink/70"
        strokeWidth={1.75}
      />
    );
    const mapPinIcon = (
      <MapPin className="h-3.5 w-3.5 text-unora-ink/70" strokeWidth={1.75} />
    );

    return (
      <div className="flex max-w-sm flex-wrap gap-2 bg-white p-4">
        <MetadataChip
          icon={globeIcon}
          label="English, French (conversational)"
        />
        <MetadataChip icon={listChecksIcon} label="Similar pace" />
        <MetadataChip icon={mapPinIcon} label="Seattle" />
      </div>
    );
  },
};
