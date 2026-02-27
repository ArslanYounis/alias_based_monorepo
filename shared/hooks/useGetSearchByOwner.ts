import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export interface OwnerSearchParams {
  ownerName?: string;
  nationalNumber?: string;
  nationalityId?: string;
  familyBookNumber?: string;
  cityNumber?: string;
  passPortNumber?: string;
  moiUnifiedNumber?: string;
  matchTypeId?: string | number;
  pageNumber?: number;
  pageSize?: number;
  [key: string]: unknown;
}

export interface IOwnerSearchResult {
  id?: string;
  cityName?: string;
  ownerId: string;
  ownerName?: string;
  ownerName_ar?: string;
  nationalNumber?: string;
  moiUnifiedNumber?: string;
  nationalityName?: string;
  nationalityName_ar?: string;
  backgroundColor?: string;
  language?: boolean;
  ownerName_E?: string;
  ownerName_A?: string;
}

export interface PaginatedOwnerResponse {
  items: IOwnerSearchResult[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

interface OwnerResponseWrapper {
  result: PaginatedOwnerResponse;
}

export const getSearchByOwner = async (
  params: OwnerSearchParams = {}
): Promise<PaginatedOwnerResponse> => {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== "" && value !== null && value !== undefined
    )
  );
  const { data } = await axios.get<OwnerResponseWrapper>("owner", {
    params: filteredParams,
  });
  return data.result;
};

export const useGetSearchByOwner = (params: OwnerSearchParams) => {
  return useQuery<PaginatedOwnerResponse>({
    queryKey: ["search-by-owner", params],
    queryFn: () => getSearchByOwner(params),
    enabled: params?.pageNumber !== undefined && !!params.pageSize,
  });
};
