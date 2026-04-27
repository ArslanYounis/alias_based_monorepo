import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export interface AllotmentCompanyOwnerSearchParams {
    companyName?: string;
    tradeLicense?: string;
    certificateNumber?: string;
    matchTypeId?: string;
    resultsDisplay?: string;
    pageNumber?: number;
    pageSize?: number;
}

export interface AllotmentCompanyOwnerSearchResult {
    companyId?: number;
    allotmentNameId?: number;
    companyName?: string;
    tradeLicense?: string;
    tradeNumber?: string;
    certificateNumber?: string;
    familyBookNumber?: string;
}

export interface AllotmentPaginatedCompanyOwnerResponse {
    items: AllotmentCompanyOwnerSearchResult[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
}

interface AllotmentCompanyOwnerResponseWrapper {
    result: AllotmentPaginatedCompanyOwnerResponse;
}

export const searchByCompanyOwner = async (
    params: AllotmentCompanyOwnerSearchParams
): Promise<AllotmentPaginatedCompanyOwnerResponse> => {
    const filteredParams = Object.fromEntries(
        Object.entries(params).filter(
            ([, value]) => value !== "" && value !== null && value !== undefined
        )
    );
    const { data } = await axios.get<AllotmentCompanyOwnerResponseWrapper>(
        "decree/company-allotment-name",
        { params: filteredParams }
    );
    return data.result;
};

export const useSearchByCompanyOwner = (params: AllotmentCompanyOwnerSearchParams) => {
    return useQuery<AllotmentPaginatedCompanyOwnerResponse>({
        queryKey: ["search-by-allotment-company-owner", params],
        queryFn: () => searchByCompanyOwner(params),
        enabled: params?.pageNumber !== undefined && !!params.pageSize,
    });
};
