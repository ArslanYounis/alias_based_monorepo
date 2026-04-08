const path = require("path");

/** @type {import('jest').Config} */
module.exports = {
  // Absolute rootDir so jest resolves shared/ and mobile/ consistently
  // regardless of the working directory (npm workspace runs from mobile/).
  rootDir: path.resolve(__dirname, ".."),

  // jest-expo@54 preset matched to Expo SDK 54.
  // Sets up: react-native test env, auto-mocks for native modules.
  preset: "jest-expo",

  // Override the default babel transform so babel-preset-expo does NOT auto-add
  // react-native-reanimated plugin (requires react-native-worklets, not in test env).
  transform: {
    "^.+\\.[jt]sx?$": [
      "babel-jest",
      {
        configFile: false,
        babelrc: false,
        presets: [
          [
            "babel-preset-expo",
            { jsxImportSource: "react", reanimated: false },
          ],
        ],
      },
    ],
  },

  // Extend the default jest-expo transformIgnorePatterns to also transform
  // additional packages that ship as ESM or uncompiled TypeScript.
  transformIgnorePatterns: [
    "node_modules/(?!(.pnpm|react-native|@react-native|@react-native-community|expo|expo-modules-core|@expo|@expo-google-fonts|react-navigation|@react-navigation|@sentry/react-native|native-base|@rn-primitives|nativewind|react-native-reanimated|react-native-worklets|react-native-svg|react-native-css-interop|react-native-linear-gradient|react-native-keyboard-aware-scroll-view|lucide-react-native))",
    "node_modules/react-native-reanimated/plugin/",
  ],

  // Map monorepo path aliases used in source and shared code.
  // All <rootDir> tokens now resolve to the monorepo root.
  moduleNameMapper: {
    // Prevent expo's lazy __ExpoImportMetaRegistry getter from being set up via
    // a deferred require() which jest-runtime rejects outside of test-code scope.
    "^expo/src/winter$": "<rootDir>/mobile/__mocks__/expo-winter.js",
    "^expo/src/winter/(.*)$": "<rootDir>/mobile/__mocks__/expo-winter.js",
    // @platform/* → mobile/src/ui/*
    "^@platform/(.*)$": "<rootDir>/mobile/src/ui/$1",
    // @shared/* → shared/*
    "^@shared/(.*)$": "<rootDir>/shared/$1",
    // ~/  → mobile root (Expo/Metro convention used in mobile)
    "^~/(.*)$": "<rootDir>/mobile/$1",

    // Mock static assets
    "^.+\\.(png|jpg|jpeg|gif)$": "<rootDir>/mobile/__mocks__/fileMock.js",
  },

  // File extensions Jest resolves (mirrors Metro config)
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  setupFilesAfterEnv: ["<rootDir>/mobile/jest.setup.ts"],

  // Test files location — scoped to mobile/src/ so shared/ is never discovered.
  testMatch: [
    "<rootDir>/mobile/src/**/__tests__/**/*.{ts,tsx}",
    "<rootDir>/mobile/src/**/*.{test,spec}.{ts,tsx}",
  ],

  // Coverage configuration (>80% target).
  // Scoped to only the source files that have corresponding test suites.
  // Expand this list as more test suites are added.
  // ** prefix is required — jest's shouldInstrument check uses micromatch against
  // absolute file paths, so patterns without ** never match absolute paths.
  collectCoverageFrom: [
    "**/mobile/src/ui/**/*.{ts,tsx}",
    "**/mobile/src/hooks/**/*.{ts,tsx}",
    "**/shared/components/**/*.{ts,tsx}",
    "**/shared/hooks/**/*.{ts,tsx}",
  ],

  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  coverageReporters: ["text", "lcov", "html"],

  coverageDirectory: "<rootDir>/mobile/coverage",
};
