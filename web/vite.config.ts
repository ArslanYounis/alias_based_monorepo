import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "path";
// import dts from "vite-plugin-dts";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
    federation({
      name: "componentLibrary",
      filename: "remoteEntry.js",
      shared: ["react", "react-dom"],
      exposes: {
        "./service-builder-config": resolve(
          __dirname,
          "src/federation/service-builder.config.ts",
        ),
        "./service-renderer-config": resolve(
          __dirname,
          "src/federation/service-renderer.config.ts",
        ),
        "./form-builder-config": resolve(
          __dirname,
          "src/federation/form-builder.config.ts",
        ),
        "./form-renderer-config": resolve(
          __dirname,
          "src/federation/form-renderer.config.ts",
        ),
        "./public-component": resolve(
          __dirname,
          "src/federation/public-component.ts",
        ),
        "./icon-registry": resolve(
          __dirname,
          "src/federation/icon-registry.ts",
        ),
      },
    }),
  ],
  resolve: {
    alias: {
      "@platform": resolve(__dirname, "src/ui"),
      "@shared": resolve(__dirname, "../shared"),
    },
  },
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: true,
  },

  // build: {
  //   copyPublicDir: false,
  //   lib: {
  //     entry: resolve(__dirname, "src/dls/index.ts"),
  //     name: "DLS",
  //     formats: ["es"],
  //     fileName: "index",
  //   },
  //   rollupOptions: {
  //     external: [
  //       "react",
  //       "react-dom",
  //       "axios",
  //       "@tanstack/react-query",
  //       "react/jsx-runtime",
  //       "tailwindcss",
  //     ],
  //   },
  // },
});
