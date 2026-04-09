import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface PlotSearchParams {
  requestId?: number;
  municipality?: string;
  landuseId?: string;
  zone?: string;
  publicHouseNo?: string;
  sector?: string;
  roadId?: string;
  plotNumber?: string;
  plotFileNumber?: string;
  matchTypeId?: string | number;
  pageSize?: number;
  searchPlotFlags?: string;
  searchOwnerFlags?: string;
  ownerId?: string;
  pageNumber?: number;
  totalCount?: number;
  [key: string]: unknown;
}

export interface PlotSearchResult {
  plotId?: number;
  communityId?: number;
  code?: string;
  plotNumber?: string;
  landUseName?: string;
  landUseName_ar?: string;
  districtName?: string;
  districtName_ar?: string;
  communityName?: string;
  hasMortgage?: boolean;
  backgroundColor?: string;
  ownerId?: string;
}

export interface PaginatedPlotResponse {
  items: PlotSearchResult[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export const getSearchByPlot = async (
  params: PlotSearchParams
): Promise<PaginatedPlotResponse> => {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== "" && value !== null && value !== undefined
    )
  );
  const { data } = await axios.get<PaginatedPlotResponse>("plot/search", {
    params: filteredParams,
  });
  return data;
};

export const useGetSearchByPlot = (params: PlotSearchParams) => {
  return useQuery<PaginatedPlotResponse>({
    queryKey: ["search-by-plot", params],
    queryFn: () => getSearchByPlot(params),
    enabled: params?.pageNumber !== undefined && !!params.pageSize,
  });
};

export type { PlotSearchParams };
