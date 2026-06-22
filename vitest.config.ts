import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        resolve: {
          alias: {
            "@domain": path.resolve(__dirname, "src/client/domain"),
          },
        },
        test: {
          name: "client",
          include: ["tests/client/**/*.spec.ts"],
        },
      },
      {
        resolve: {
          alias: {
            "@domain": path.resolve(__dirname, "src/server/shared/domain"),
            "@infra": path.resolve(__dirname, "src/server/infra"),
          },
        },
        test: {
          name: "server",
          include: ["tests/server/**/*.spec.ts"],
        },
      },
      {
        test: {
          name: "scripts",
          include: ["tests/scripts/**/*.spec.ts"],
        },
      },
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: [
        "src/client/domain/**/*.ts",
        "src/server/shared/domain/**/*.ts",
      ],
      exclude: [
        "**/*.d.ts",
        "**/models/**",
        "**/constants/**",
        "**/entities.ts",
      ],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 90,
        statements: 90,
      },
    },
  },
});
