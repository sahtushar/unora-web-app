import type {Decorator, Meta, StoryObj} from "@storybook/react-vite";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

import {ActiveConnectionHint} from "@/components/ui/ActiveConnectionHint";
import {mockSession} from "@/data/mock/session";
import {queryKeys} from "@/services/queryKeys";
import type {AppSessionState} from "@/types";

function sessionDecorator(data: AppSessionState): Decorator {
  return (Story) => {
    const client = new QueryClient({
      defaultOptions: {queries: {retry: false}},
    });
    client.setQueryData(queryKeys.session, data);
    return (
      <QueryClientProvider client={client}>
        <Story />
      </QueryClientProvider>
    );
  };
}

const sessionWithPeer: AppSessionState = structuredClone(mockSession);

const sessionNoPeer: AppSessionState = {
  ...structuredClone(mockSession),
  activeConnection: null,
};

const meta = {
  title: "Components/UI/ActiveConnectionHint",
  component: ActiveConnectionHint,
  tags: ["autodocs"],
} satisfies Meta<typeof ActiveConnectionHint>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithMatch: Story = {
  decorators: [sessionDecorator(sessionWithPeer)],
  render: () => (
    <div className="max-w-md">
      <ActiveConnectionHint />
    </div>
  ),
};

export const NoMatch: Story = {
  decorators: [sessionDecorator(sessionNoPeer)],
  render: () => (
    <div className="max-w-md">
      <ActiveConnectionHint />
    </div>
  ),
};
