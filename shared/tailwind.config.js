/**
 * Tailwind config for the shared folder so the Tailwind CSS IntelliSense
 * extension can suggest classes when editing shared components.
 * Uses mobile's theme so custom tokens (e.g. button-primary-default-bg) are available.
 */
module.exports = {
  content: [
    "./**/*.{ts,tsx}",
    "../web/src/**/*.{ts,tsx}",
    "../mobile/src/**/*.{ts,tsx}",
  ],
  presets: [require("../mobile/tailwind.config.js")],
};
