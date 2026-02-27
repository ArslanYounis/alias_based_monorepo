import axios from "axios";
import { useQueries } from "@tanstack/react-query";

interface RightsHoldType {
  rightsHoldTypeNameE?: string;
  rightsHoldTypeNameA?: string;
}

interface PlotShare {
  share?: string;
  rightsHoldType?: RightsHoldType;
}

interface OwnerList {
  ownerNameE?: string;
  ownerNameA?: string;
  nationalityId?: string;
  moiUnifiedNumber?: string;
  archiveFileNumberAA?: string;
  nationalityE?: string;
  nationalityA?: string;
  hasSpecialNationality?: boolean;
  plotShares?: PlotShare[];
}

// Response type (customize based on actual response structure)
export interface PlotDetailResponse {
  ownersList: OwnerList;
  plotAddress?: string;
  plotNumber?: string;
  plotFileNumber?: string;
  plotAreaFeet?: string;
  plotAreaSquareMeter?: string;
  constructionStatusE?: string;
  constructionStatusA?: string;
  urlArgs?: string;
  community?: {
    communityNameE?: string;
    communityNameA?: string;
  };
  district?: {
    districtNameE?: string;
    districtNameA?: string;
  };
  municipality?: {
    municipalityNameE?: string;
    municipalityNameA?: string;
  };
  landUse?: {
    landuseNameE?: string;
    landuseNameA?: string;
  };
  owners?: {
    ownerNameE?: string;
    ownershipPercent?: number;
  }[];
}

// GET request function
const getPlotDetail = async (
  plotId: string | number
): Promise<PlotDetailResponse> => {
  const { data } = await axios.get<PlotDetailResponse>(
    `/plot/detail/${plotId}`
  );
  return data;
};

// Query hook - supports both single plotId and array of plotIds
const useGetPlotDetail = (
  plotIds: string[] | string | number,
  options = {}
) => {
  // Normalize input to always be an array for consistent hook calls
  const plotIdsArray = Array.isArray(plotIds)
    ? plotIds
    : plotIds !== undefined && plotIds !== null
    ? [String(plotIds)]
    : [];

  // Always use useQueries to avoid conditional hook calls
  const queries = useQueries({
    queries: plotIdsArray.map((plotId) => ({
      queryKey: ["plotDetail", plotId],
      queryFn: () => getPlotDetail(plotId),
      enabled: !!plotId,
      ...options,
    })),
  });

  // If original input was not an array, return single query result format
  if (!Array.isArray(plotIds)) {
    const singleQuery = queries[0];
    if (singleQuery) {
      return singleQuery;
    }
    // Fallback for empty array case
    return {
      data: undefined,
      isPending: false,
      isError: false,
      error: null,
      isLoading: false,
      isSuccess: false,
      refetch: async () => ({ data: undefined }),
    } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  // Return array format for array input
  return {
    data: queries
      .map((query) => query.data)
      .filter(Boolean) as PlotDetailResponse[],
    isPending: queries.some((query) => query.isPending),
    isError: queries.some((query) => query.isError),
    error: queries.find((query) => query.error)?.error,
    queries,
  };
};

export default useGetPlotDetail;
