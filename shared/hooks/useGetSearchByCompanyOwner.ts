import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export interface CompanyOwnerSearchParams {
    companyName?: string;
    tradeLicense?: string;
    certificateNumber?: string;
    westernRegionArchiveNo?: string;
    abuDhabiArchiveNo?: string;
    alAinArchiveNo?: string;
    matchType?: string;
    resultsDisplay?: string;
    pageNumber?: number;
    pageSize?: number;
}

export interface CompanyOwnerSearchResult {
    companyId?: number;
    ownerId?: number;
    companyName?: string;
    tradeLicense?: string;
    certificateNumber?: string;
    westernRegionArchiveNo?: string;
    abuDhabiArchiveNo?: string;
    alAinArchiveNo?: string;
}

export interface PaginatedCompanyOwnerResponse {
    items: CompanyOwnerSearchResult[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
}

interface CompanyOwnerResponseWrapper {
    result: PaginatedCompanyOwnerResponse;
}

export const getSearchByCompanyOwner = async (
    params: CompanyOwnerSearchParams
): Promise<PaginatedCompanyOwnerResponse> => {
    const filteredParams = Object.fromEntries(
        Object.entries(params).filter(
            ([, value]) => value !== "" && value !== null && value !== undefined
        )
    );
    const { data } = await axios.get<CompanyOwnerResponseWrapper>(
        "owner/companies",
        { params: filteredParams }
    );
    return data.result;
};

export const useGetSearchByCompanyOwner = (params: CompanyOwnerSearchParams) => {
    return useQuery<PaginatedCompanyOwnerResponse>({
        queryKey: ["search-by-company-owner", params],
        queryFn: () => getSearchByCompanyOwner(params),
        enabled: params?.pageNumber !== undefined && !!params.pageSize,
    });
};
