import type {Meta, StoryObj} from "@storybook/react-vite";

import {Button} from "@/components/ui/Button";
import {Toast} from "@/components/ui/Toast";
import {ToastProvider, useToast} from "@/components/ui/ToastProvider";

const meta = {
  title: "Components/UI/Toast",
  component: Toast,
  tags: ["autodocs"],
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    title: "Heads up",
    description: "Your profile details were saved quietly in the background.",
    tone: "info",
  },
};

export const Success: Story = {
  args: {
    title: "Saved",
    description: "Everything looks great. You are all set.",
    tone: "success",
  },
};

export const ErrorTone: Story = {
  args: {
    title: "Session expired",
    description: "Please sign in again to keep editing your profile.",
    tone: "error",
  },
};

function ToastTriggerDemo() {
  const {showToast} = useToast();
  return (
    <div className="space-y-3">
      <Button
        variant="secondary"
        onClick={() => {
          showToast({
            tone: "error",
            title: "Session expired",
            description:
              "Sign in again and we will continue from where you paused.",
          });
        }}>
        Trigger Toast
      </Button>
      <p className="text-xs text-unora-mist">
        Click to preview provider-driven toasts.
      </p>
    </div>
  );
}

export const WithProvider: Story = {
  args: {
    title: "Toast preview",
  },
  render: () => (
    <ToastProvider>
      <ToastTriggerDemo />
    </ToastProvider>
  ),
};
