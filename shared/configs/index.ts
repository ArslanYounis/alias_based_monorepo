export { createButtonConfig } from "./button.config";
export { createPaginationConfig } from "./pagination.config";
export { createDummyConfig } from "../components/DummyComponent/config";
export { createPlotSearchConfig } from "../components/PlotSearch/config";
export { createLargeComponentConfig } from "../components/LargeComponent/config";

/** Config ids for service builder (used by web; mobile uses renderer only) */
export const SERVICE_BUILDER_CONFIG_IDS = [
  "button",
  "pagination",
  "dummy",
  "plot-search",
  "largeComponent",
] as const;
