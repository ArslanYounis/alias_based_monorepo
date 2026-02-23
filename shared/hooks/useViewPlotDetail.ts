import axios from "axios";
import { useQueries, useQuery } from "@tanstack/react-query";

export interface PlotShare {
  share?: string;
  rightsHoldType?: { rightsHoldTypeNameE?: string; rightsHoldTypeNameA?: string };
}

export interface PlotDetailOwnersList {
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

export interface PlotDetailResponse {
  ownersList?: PlotDetailOwnersList;
  plotAddress?: string;
  plotNumber?: string;
  plotFileNumber?: string;
  plotAreaFeet?: string;
  plotAreaSquareMeter?: string;
  constructionStatusE?: string;
  constructionStatusA?: string;
  urlArgs?: string;
  community?: { communityNameE?: string; communityNameA?: string };
  district?: { districtNameE?: string; districtNameA?: string };
  municipality?: { municipalityNameE?: string; municipalityNameA?: string };
  landUse?: { landuseNameE?: string; landuseNameA?: string };
  owners?: { ownerNameE?: string; ownershipPercent?: number }[];
}

const getPlotDetail = async (
  plotId: string | number
): Promise<PlotDetailResponse> => {
  const { data } = await axios.get<PlotDetailResponse>(
    `/plot/detail/${plotId}`
  );
  return data;
};

/** Single plotId: returns single query result. */
export function useViewPlotDetail(plotId: string | number | undefined) {
  return useQuery<PlotDetailResponse>({
    queryKey: ["plotDetail", plotId],
    queryFn: () => getPlotDetail(plotId!),
    enabled: plotId !== undefined && plotId !== null && plotId !== "",
  });
}

/** Multiple plotIds: returns useQueries result. */
export function useViewPlotDetails(plotIds: (string | number)[]) {
  return useQueries({
    queries: plotIds.map((plotId) => ({
      queryKey: ["plotDetail", plotId],
      queryFn: () => getPlotDetail(plotId),
      enabled: !!plotId,
    })),
  });
}

export { getPlotDetail };
