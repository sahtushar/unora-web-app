import type {Preview} from "@storybook/react";
import React, {type ReactNode} from "react";

import {MemoryRouter} from "react-router-dom";

import {AppProviders} from "../src/app/providers/AppProviders";
import "../src/index.css";

function withApp(Story: () => ReactNode): ReactNode {
  return (
    <MemoryRouter initialEntries={["/"]}>
      <AppProviders>
        <div className="app-canvas min-h-[min(100dvh,48rem)] p-app-4">
          <Story />
        </div>
      </AppProviders>
    </MemoryRouter>
  );
}

const preview: Preview = {
  decorators: [withApp],
  parameters: {
    layout: "fullscreen",
    options: {
      storySort: (a, b) =>
        a.id === b.id
          ? 0
          : a.id.localeCompare(b.id, undefined, {numeric: true}),
    },
  },
};

export default preview;
