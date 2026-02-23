/**
 * OwnerSearch: re-export plot/owner/company search for owner-type flows.
 * Use useSearchByOwner or useGetSearchByCompanyOwner from useSearchPlot for actual API.
 */
export { useSearchByOwner, getSearchByOwner } from "./useSearchPlot";
export type {
  OwnerSearchParams,
  OwnerSearchResult,
  PaginatedOwnerResponse,
} from "./useSearchPlot";
export { useGetSearchByCompanyOwner, getSearchByCompanyOwner } from "./useGetSearchByCompanyOwner";
export type {
  CompanyOwnerSearchParams,
  CompanyOwnerSearchResult,
  PaginatedCompanyOwnerResponse,
} from "./useGetSearchByCompanyOwner";
