import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export interface TenancyContractItem {
    contractNumber: string;
    tenancyContractId: string;
    startDate: string;
    isRenew: number;
    urlArgs?: string | null;
}

export interface TenancyContractsResult {
    totalCount: number;
    items: TenancyContractItem[];
    urlArgs?: string | null;
    pageSize?: number;
    pageNumber?: number;
}

export interface PaginatedTenancyContractsResponse {
    result: TenancyContractsResult;

}

export type GetTenancyContractsParams = {
    tenancyContractId?: string;
    contractType?: string;
    contractNumber?: string;
    startDate?: string;
    matchTypeId?: string;
    pageSize?: number;
    pageNumber?: number;
};


// API function
const getTenancyContracts = async (
    params: GetTenancyContractsParams
): Promise<TenancyContractsResult> => {
    const { data } = await axios.get<PaginatedTenancyContractsResponse>(
        "tenancy/contracts",
        { params }
    );

    return data?.result;
};

// React Query hook
export const useGetTenancyContracts = (
    params: GetTenancyContractsParams
) => {
    return useQuery<TenancyContractsResult>({
        queryKey: ["tenancy-contracts", params],
        queryFn: () => getTenancyContracts(params),
        enabled: !!params && Object.keys(params).length > 0,
    });
};


export { getTenancyContracts };
