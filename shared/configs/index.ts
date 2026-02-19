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
export { createTitleBarConfig } from "./titleBar.config";
export { createFilterBarConfig } from "./filterBar.config";
export { createSignatureConfig } from "./signature.config";
export { createUploadDocumentsConfig } from "./uploadDocuments.config";
export { createPaymentDetailsConfig } from "./paymentDetails.config";
export { createAuditRemarksConfig } from "./auditRemarks.config";
export { createViewPlotDetailConfig } from "./viewPlotDetail.config";
export { createOwnerSearchConfig } from "./ownerSearch.config";
export { createSearchPlotConfig } from "./searchPlot.config";
export { createPaymentConfig } from "./payment.config";
export { createNewApplicationSummaryConfig } from "./newApplicationSummary.config";
export { createApplicationSummaryConfig } from "./applicationSummary.config";
export { createCardTitleConfig } from "./cardTitle.config";
export { createModalTitleConfig } from "./modalTitle.config";
export { createModalStepsConfig } from "./modalSteps.config";
export { createTableConfig } from "./table.config";
export { createOwnerCardConfig } from "./ownerCard.config";
export { createPlotCardConfig } from "./plotCard.config";
export { createApplicationDetailConfig } from "./applicationDetail.config";
export { createViewOwnerDetailConfig } from "./viewOwnerDetail.config";
export { createTestComponentConfig } from "./testComponent.config";
export { createApplicationMessageConfig } from "./applicationMessage.config";
export { createGenericCardConfig } from "./genericCard.config";
export { createGenericCardsConfig } from "./genericCards.config";
export { createGenericTableCardConfig } from "./genericTableCard.config";
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
