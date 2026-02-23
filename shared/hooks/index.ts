/**
 * Shared data hooks and mutations for Tier 3 components.
 * Requires axios (with baseURL) and @tanstack/react-query in the consuming app.
 */
export { useGetSearchByCompanyOwner, getSearchByCompanyOwner } from "./useGetSearchByCompanyOwner";
export type {
  CompanyOwnerSearchParams,
  CompanyOwnerSearchResult,
  PaginatedCompanyOwnerResponse,
} from "./useGetSearchByCompanyOwner";

export { useApplicationSummary } from "./useApplicationSummary";
export { useApplicationDetail } from "./useApplicationDetail";
export type { ApplicationDetailResult } from "./useApplicationDetail";

export { usePayment } from "./usePayment";
export { useViewPlotDetail, useViewPlotDetails, getPlotDetail } from "./useViewPlotDetail";
export type { PlotDetailResponse } from "./useViewPlotDetail";
export { useGetPlotImage, getPlotImage } from "./useGetPlotImage";

export {
  useSearchByPlot,
  useSearchByOwner,
  getSearchByPlot,
  getSearchByOwner,
  useGetSearchByCompanyOwner,
  getSearchByCompanyOwner,
} from "./useSearchPlot";
export type {
  PlotSearchParams,
  PlotSearchResult,
  PaginatedPlotResponse,
  OwnerSearchParams,
  OwnerSearchResult,
  PaginatedOwnerResponse,
} from "./useSearchPlot";

export { useNewApplicationSummary } from "./useNewApplicationSummary";
export { usePaymentDetailsSubmit } from "./usePaymentDetails";
export type { PaymentDetailsSubmitPayload } from "./usePaymentDetails";
export { useAuditRemarksSubmit } from "./useAuditRemarks";
export type { AuditRemarksSubmitPayload } from "./useAuditRemarks";
export { useUploadDocuments } from "./useUploadDocuments";
export type { UploadDocumentsPayload } from "./useUploadDocuments";
