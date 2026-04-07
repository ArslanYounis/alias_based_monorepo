import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

/**
 * Separate vitest config (avoids loading the federation plugin during tests,
 * which is not needed and causes issues with the test environment).
 *
 * Aliases mirror web/vite.config.ts + web/tsconfig.app.json:
 *   @platform/* → web/src/ui/*
 *   @shared/*   → shared/*
 *   @/*         → web/src/*
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@platform": resolve(__dirname, "src/ui"),
      "@shared": resolve(__dirname, "../shared"),
      "@": resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/setupTests.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "istanbul",
      reporter: ["text", "lcov", "html"],
      // istanbul provider is required for allowExternal (files outside web/).
      // Scope to only the components with tests in this first step.
      allowExternal: true,
      include: [
        "**/web/src/ui/AddButton/AddButton.tsx",
        "**/shared/components/Agent/Agent.tsx",
        "**/shared/components/SharedLanguageSwitchRenderer.tsx",
      ],
      exclude: ["**/*.stories.*", "**/*.d.ts", "**/node_modules/**"],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
});
