import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export interface IOwnerPlotsSearchResult {
  id?: string;
  plotId?: string | number;
  communityName?: string;
  districtname?: string;
  landuseName?: string;
}

export interface PaginatedOwnerPlotsResponse {
  ownerPlots: IOwnerPlotsSearchResult[];
  totalCount?: number;
  pageNumber?: number;
  pageSize?: number;
}

const getOwnerPlots = async (
  ownerId: string
): Promise<PaginatedOwnerPlotsResponse> => {
  const { data } = await axios.get<PaginatedOwnerPlotsResponse>("owner/plots", {
    params: { ownerId },
  });
  return data;
};

export const useGetOwnerPlots = (ownerId: string) => {
  return useQuery<PaginatedOwnerPlotsResponse>({
    queryKey: ["owner-plots", ownerId],
    queryFn: () => getOwnerPlots(ownerId),
    enabled: false,
  });
};

export { getOwnerPlots };
