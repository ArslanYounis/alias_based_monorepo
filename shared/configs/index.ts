export { createAddMoreButtonConfig } from "./addMoreButton.config";
export { createBreadcrumbConfig } from "./breadcrumb.config";
export { createButtonConfig } from "./button.config";
export { createPaginationConfig } from "./pagination.config";
export { createPromptConfig } from "./prompt.config";
export { createScreenLoaderConfig } from "./screenLoader.config";
export { createTypographyConfig } from "./typography.config";
export { createTextInputConfig } from "./textInput.config";
export { createTextAreaConfig } from "./textArea.config";
export { createSelectConfig } from "./select.config";
export { createMultiSelectConfig } from "./multiSelect.config";
export { createCurrencyConfig } from "./currency.config";
export { createNumberConfig } from "./number.config";
export { createDateSelectConfig } from "./dateSelect.config";
export { createCheckboxFieldConfig } from "./checkboxField.config";
export { createCheckboxInputConfig } from "./checkboxInput.config";
export { createRadioFieldConfig } from "./radioField.config";
export { createRadioInputConfig } from "./radioInput.config";
export { createPhoneInputConfig } from "./phoneInput.config";

/** Config ids for service builder (used by web; mobile uses renderer only) */
export const SERVICE_BUILDER_CONFIG_IDS = [
  "addMoreButton",
  "breadcrumb",
  "button",
  "pagination",
  "prompt",
  "screenLoader",
  "typography",
] as const;
