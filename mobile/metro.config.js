const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require("nativewind/metro");
const path = require("node:path");

const config = getDefaultConfig(__dirname);

config.projectRoot = __dirname;
config.watchFolders = [path.resolve(__dirname, "../shared")];

config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    "@platform": path.resolve(__dirname, "src/ui"),
    "@shared": path.resolve(__dirname, "../shared"),
  },
};

module.exports = withNativeWind(config, { input: "./global.css" });

