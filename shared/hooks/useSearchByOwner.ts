import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export interface AllotmentOwnerSearchParams {
    pageNumber?: number;
    pageSize?: number;
}

export interface AllotmentOwnerSearchResult {
    id?: string;
    ownerName?: string;
    fullName?: string;
    allotmentNameId?: string;
    familyBookNumber?: string;
}

export interface AllotmentPaginatedOwnerResponse {
    items: AllotmentOwnerSearchResult[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
}

interface OwnerResponseWrapper {
    result: AllotmentPaginatedOwnerResponse;
}

export const searchByOwner = async (
    params: AllotmentOwnerSearchParams = {}
): Promise<AllotmentPaginatedOwnerResponse> => {
    const filteredParams = Object.fromEntries(
        Object.entries(params).filter(
            ([, value]) => value !== "" && value !== null && value !== undefined
        )
    );
    const { data } = await axios.get<OwnerResponseWrapper>(
        `decree/owner-allotment-name`,
        { params: filteredParams }
    );
    return data.result;
};

export const useSearchByOwner = (params: AllotmentOwnerSearchParams) => {
    return useQuery<AllotmentPaginatedOwnerResponse>({
        queryKey: ["search-by-allotment-owner", params],
        queryFn: () => searchByOwner(params),
        enabled: params?.pageNumber !== undefined && !!params.pageSize,
    });
};
