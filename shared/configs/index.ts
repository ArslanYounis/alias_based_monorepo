export { createAddMoreButtonConfig } from "./addMoreButton.config";
export { createBreadcrumbConfig } from "./breadcrumb.config";
export { createButtonConfig } from "./button.config";
export { createPaginationConfig } from "./pagination.config";
export { createPromptConfig } from "./prompt.config";
export { createScreenLoaderConfig } from "./screenLoader.config";
export { createTypographyConfig } from "./typography.config";
export { createDummyConfig } from "../components/DummyComponent/config";
export { createPlotSearchConfig } from "../components/PlotSearch/config";
export { createLargeComponentConfig } from "../components/LargeComponent/config";

/** Config ids for service builder (used by web; mobile uses renderer only) */
export const SERVICE_BUILDER_CONFIG_IDS = [
  "addMoreButton",
  "breadcrumb",
  "button",
  "pagination",
  "prompt",
  "screenLoader",
  "typography",
  "dummy",
  "plot-search",
  "largeComponent",
] as const;
