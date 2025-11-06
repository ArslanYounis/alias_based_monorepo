import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig(({}) => {
  const isLibraryBuild = process.env.BUILD_LIB === "true";

  return {
    plugins: [
      react(),
      ...(isLibraryBuild
        ? [
            dts({
              insertTypesEntry: true,
              include: [
                "index.ts",
                "src/ui/**/*.ts",
                "src/ui/**/*.tsx",
                "../shared/**/*.ts",
                "../shared/**/*.tsx",
              ],
              exclude: [
                "node_modules",
                "dist",
                "**/*.test.ts",
                "**/*.test.tsx",
                "src/app/**",
              ],
              rollupTypes: true,
              copyDtsFiles: true,
            }),
          ]
        : []),
    ],
    resolve: {
      alias: {
        "@platform": path.resolve(__dirname, "src/ui"),
        "@shared": path.resolve(__dirname, "../shared"),
      },
    },
    ...(isLibraryBuild
      ? {
          build: {
            lib: {
              entry: path.resolve(__dirname, "index.ts"),
              name: "UIComponents",
              formats: ["es", "cjs"],
              fileName: (format) => `index.${format === "es" ? "mjs" : "js"}`,
            },
            rollupOptions: {
              external: ["react", "react-dom"],
              output: {
                globals: {
                  react: "React",
                  "react-dom": "ReactDOM",
                },
              },
            },
            outDir: "dist",
          },
        }
      : {}),
  };
});
