import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
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
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  resolve: {
    alias: {
      "@platform": resolve(__dirname, "src/ui"),
      "@shared": resolve(__dirname, "../shared"),
      "@": resolve(__dirname, "src"),
    },
  },
  test: {
    // Root set to monorepo root so shared/ is treated as internal (not external).
    // This allows all:true to scan shared/ for coverage without allowExternal.
    root: resolve(__dirname, ".."),
    environment: "jsdom",
    globals: true,
    setupFiles: ["web/src/setupTests.ts"],
    include: ["web/src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      reportsDirectory: resolve(__dirname, "coverage"),
      include: [
        "web/src/ui/**/*.{ts,tsx}",
        "web/src/hooks/**/*.{ts,tsx}",
        "shared/components/**/*.{ts,tsx}",
        "shared/hooks/**/*.{ts,tsx}",
      ],
      exclude: [
        "**/*.stories.*",
        "**/*.d.ts",
        "**/node_modules/**",
        "**/__tests__/**",
        "**/*.{test,spec}.{ts,tsx}",
        // Barrel re-export files — v8 cannot instrument pure re-exports
        "**/index.ts",
        // Config-only files — constant data, no testable logic
        "**/*.config.ts",
        // Type-only files
        "**/*.types.ts",
      ],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
});
