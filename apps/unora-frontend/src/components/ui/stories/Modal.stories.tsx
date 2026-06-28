import {useState} from "react";

import type {Meta, StoryObj} from "@storybook/react-vite";

import {Button} from "@/components/ui/Button";
import {Modal} from "@/components/ui/Modal";

const meta = {
  title: "Components/UI/Modal",
  component: Modal,
  tags: ["autodocs"],
  args: {
    open: false,
    onClose: () => {},
    title: "",
    animation: "fade-scale" as const,
    animationDurationMs: 220,
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function ModalPlayground() {
    const [open, setOpen] = useState(false);
    return (
      <div className="space-y-app-4">
        <Button type="button" size="sm" onClick={() => setOpen(true)}>
          Open modal
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Calm confirmations"
          description="Backdrops use ink scrim tokens; the panel sits on snow with line borders — same language as cards."
          footer={
            <div className="flex flex-col gap-app-2 sm:flex-row-reverse">
              <Button
                type="button"
                className="flex-1"
                onClick={() => setOpen(false)}>
                Sounds good
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => setOpen(false)}>
                Not now
              </Button>
            </div>
          }>
          <p className="text-sm leading-relaxed text-unora-mist">
            Body copy lives in the scrollable region when content runs long.
          </p>
        </Modal>
      </div>
    );
  },
};

export const FadeOnly: Story = {
  render: function FadeOnlyModal() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button type="button" size="sm" onClick={() => setOpen(true)}>
          Open (fade)
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          animation="fade"
          title="Opacity only"
          description="Same dismiss choreography with a softer motion — no scale."
          footer={
            <Button
              type="button"
              className="w-full"
              onClick={() => setOpen(false)}>
              Close
            </Button>
          }
        />
      </>
    );
  },
};

export const TitleOnly: Story = {
  render: function TitleOnlyModal() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button type="button" size="sm" onClick={() => setOpen(true)}>
          Open
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Short note"
          footer={
            <Button
              type="button"
              className="w-full"
              onClick={() => setOpen(false)}>
              Close
            </Button>
          }
        />
      </>
    );
  },
};
