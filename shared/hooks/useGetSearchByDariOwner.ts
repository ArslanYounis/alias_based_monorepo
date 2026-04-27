import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export interface DariOwnerSearchParams {
    pageNumber?: number;
    pageSize?: number;
}

export interface DariOwnerSearchResultProps {
    ownerId?: number | string;
    ownerID?: number | string;
    ownerNameEn?: string;
    ownerNameAr?: string;
    emiratesID?: string;
    unifiedNumber?: string;
    familyNo?: string;
    cityNo?: string;
    mobileNo?: string;
    licenseNo?: string;
    chamberNo?: string;
    isBlocked?: boolean;
    passportNo?: string;
    birthDate?: string;
    nationalityID?: string;
    nationalityNameEn?: string;
    nationalityNameAr?: string;
    ownerType?: string;
    gender?: string;
    familyNameEn?: string;
    familyNameAr?: string;
    isDari?: boolean;
    email?: string;
    ownerSource?: string;
    ownerSourceAR?: string;
}

export interface PaginatedDariOwnerResponse {
    items: DariOwnerSearchResultProps[];
    totalCount?: number;
    pageNumber?: number;
    pageSize?: number;
}

interface OwnerApiResponse {
    owners: DariOwnerSearchResultProps[];
    totalCount?: number;
}

export const getSearchByDariOwner = async (
    params: DariOwnerSearchParams = {}
): Promise<PaginatedDariOwnerResponse> => {
    const filteredParams = Object.fromEntries(
        Object.entries(params).filter(
            ([, value]) => value !== "" && value !== null && value !== undefined
        )
    );

    const { data } = await axios.post<OwnerApiResponse>(
        `dari/authentication/owner-search`,
        filteredParams
    );

    return {
        items: data.owners || [],
        totalCount: data.totalCount,
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
    };
};

export const useGetSearchByDariOwner = (params: DariOwnerSearchParams) => {
    return useQuery<PaginatedDariOwnerResponse>({
        queryKey: ["search-by-dari-owner", params],
        queryFn: () => getSearchByDariOwner(params),
        enabled: params?.pageNumber !== undefined && !!params.pageSize,
    });
};
