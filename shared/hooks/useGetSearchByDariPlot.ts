import axios from "axios";
import { useQuery } from "@tanstack/react-query";

/** Body for `dari/property/properties` — keys match backend contract. */
export interface DariPlotSearchParams {
    municipalityID?: number;
    districtID?: number;
    communityID?: number;
    plotNumber?: string;
    plotAddress?: string;
    propertyType?: number;
    landUseID?: number;
    orderBy?: string;
    direction?: string;
    searchFlags?: number;
    publicHouseNumber?: string;
    /** API spelling (lowercase `file`) */
    plotfileNumber?: string;
    page?: number;
    pageSize?: number;
    searchBy?: number;
    matchType?: number;
}

export interface DariPlotSearchResult {
    plotID?: number;
    communityID?: number;
    plotNumber?: string;
    landUseNameEn?: string;
    landUseNameAr?: string;
    communityNameEn?: string;
    communityNameAr?: string;
    isMortgaged?: boolean;
}

export interface PaginatedDariPlotResponse {
    result: {
        properties: DariPlotSearchResult[];
        totalCount: number;
        pageNumber: number;
    };
    pageSize: number;
}

const getSearchByDariPlot = async (
    params: DariPlotSearchParams
): Promise<PaginatedDariPlotResponse> => {
    const { data } = await axios.post<PaginatedDariPlotResponse>(
        "dari/property/properties",
        params
    );

    return data;
};

export const useGetSearchByDariPlot = (params: DariPlotSearchParams) => {
    return useQuery<PaginatedDariPlotResponse>({
        queryKey: ["search-by-dari-plot", params],
        queryFn: () => getSearchByDariPlot(params),
        enabled: params?.page !== undefined && !!params.pageSize,
    });
};

export { getSearchByDariPlot };
