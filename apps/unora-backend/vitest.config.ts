import {defineConfig} from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    hookTimeout: 30_000,
    include: ["test/**/*.test.ts", "src/**/*.test.ts"],
    setupFiles: ["test/setupEnv.ts"],
    testTimeout: 30_000,
  },
});
