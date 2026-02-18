const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require("nativewind/metro");
const path = require("node:path");

const config = getDefaultConfig(__dirname);

config.projectRoot = __dirname;
config.watchFolders = [path.resolve(__dirname, "../shared")];

// Force a single copy of React so hooks work (avoids "Invalid hook call" when
// some code resolved react from mobile/node_modules and other from root).
const reactPath = path.dirname(require.resolve("react", { paths: [__dirname] }));

config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    "@platform": path.resolve(__dirname, "src/ui"),
    "@shared": path.resolve(__dirname, "../shared"),
    react: reactPath,
  },
};

module.exports = withNativeWind(config, { input: "./global.css" });

