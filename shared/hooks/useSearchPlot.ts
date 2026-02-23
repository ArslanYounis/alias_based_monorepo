/**
 * SearchPlot API hooks: by plot, by owner, by company owner.
 * Re-exports useGetSearchByCompanyOwner and adds useGetSearchByPlot / useGetSearchByOwner
 * so the SearchPlot component can use one place for all search APIs.
 */
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

// --- Plot search
export interface PlotSearchParams {
  requestId?: number;
  municipality?: string;
  landuseId?: string;
  zone?: string;
  publicHouseNo?: string;
  sector?: string;
  roadId?: string;
  plotNumber?: string;
  plotFileNumber?: string;
  matchTypeId?: number;
  pageSize?: number;
  pageNumber?: number;
  searchPlotFlags?: string;
  searchOwnerFlags?: string;
  ownerId?: string;
  totalCount?: number;
}

export interface PlotSearchResult {
  plotId?: number;
  communityId?: number;
  code?: string;
  plotNumber?: string;
  landUseName?: string;
  hasMortgage?: boolean;
  backgroundColor?: string;
}

export interface PaginatedPlotResponse {
  items: PlotSearchResult[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

const filterParams = <T extends Record<string, unknown>>(params: T): Partial<T> =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== "" && v !== null && v !== undefined
    )
  ) as Partial<T>;

export async function getSearchByPlot(
  params: PlotSearchParams
): Promise<PaginatedPlotResponse> {
  const { data } = await axios.get<PaginatedPlotResponse>("plot/search", {
    params: filterParams(params),
  });
  return data;
}

export function useSearchByPlot(params: PlotSearchParams) {
  return useQuery<PaginatedPlotResponse>({
    queryKey: ["search-by-plot", params],
    queryFn: () => getSearchByPlot(params),
    enabled:
      params?.pageNumber !== undefined && !!params?.pageSize,
  });
}

// --- Owner search
export interface OwnerSearchParams {
  pageNumber?: number;
  pageSize?: number;
  nationalNumber?: string;
  ownerName?: string;
  [key: string]: unknown;
}

export interface OwnerSearchResult {
  ownerId?: number;
  ownerName?: string;
}

export interface PaginatedOwnerResponse {
  items: OwnerSearchResult[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export async function getSearchByOwner(
  params: OwnerSearchParams = {}
): Promise<PaginatedOwnerResponse> {
  const { data } = await axios.get<{ result: PaginatedOwnerResponse }>(
    "owner",
    { params: filterParams(params) }
  );
  return data.result;
}

export function useSearchByOwner(params: OwnerSearchParams) {
  return useQuery<PaginatedOwnerResponse>({
    queryKey: ["search-by-owner", params],
    queryFn: () => getSearchByOwner(params),
    enabled: params?.pageNumber !== undefined && !!params?.pageSize,
  });
}

// --- Company owner (re-export from existing hook)
export {
  useGetSearchByCompanyOwner,
  getSearchByCompanyOwner,
} from "./useGetSearchByCompanyOwner";
export type {
  CompanyOwnerSearchParams,
  CompanyOwnerSearchResult,
  PaginatedCompanyOwnerResponse,
} from "./useGetSearchByCompanyOwner";
