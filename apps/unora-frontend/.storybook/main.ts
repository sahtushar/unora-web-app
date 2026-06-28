import type {StorybookConfig} from "@storybook/react-vite";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {mergeConfig} from "vite";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx|js|jsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-docs"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {},
  typescript: {
    reactDocgen: "react-docgen",
    check: true,
  },
  core: {},
  viteFinal: async (config) => {
    config.plugins = config.plugins?.filter(
      (plugin) =>
        plugin &&
        !Array.isArray(plugin) &&
        typeof plugin !== "boolean" &&
        !(plugin instanceof Promise) &&
        plugin.name !== "storybook:react-docgen-plugin"
    );

    return mergeConfig(config, {
      resolve: {
        alias: {
          "@": path.resolve(rootDir, "../src"),
        },
      },
      server: {
        host: "127.0.0.1",
        allowedHosts: ["127.0.0.1", "localhost"],
      },
    });
  },
};

export default config;
