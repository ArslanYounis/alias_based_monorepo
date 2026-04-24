import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface Owner {
    ownerID: number;
    ownernameEn?: string;
    ownernameAr?: string;
    unifiedNumber?: string;
    emiratesID?: string | null;
    passportNumber?: string;
    nationalityEn?: string;
    nationalityAr?: string;
    familyBookNumber?: string;
    onlineServiceStatus?: string;
    tribenameEn?: string;
    tribenameAr?: string;
    hasSpecialNationality?: boolean;
    archiveNumber?: number;
    mobileNo?: string;
    homePhone?: string;
    email?: string | null;
}

export interface DariOwnerDetailApiResponse {
    success: boolean;
    result: {
        owner: Owner;
    };
}

// GET request function
const getDariOwnerDetail = async (ownerId: string | number): Promise<Owner> => {
    const response = await axios.get<DariOwnerDetailApiResponse>(
        `/dari/owner/details/${ownerId}`
    );

    return response?.data?.result?.owner;
};

const useGetDariOwnerDetail = (ownerId?: string | number) => {
    return useQuery<Owner, Error>({
        queryKey: ["ownerDetail", ownerId],
        queryFn: () => getDariOwnerDetail(ownerId!),
        enabled: !!ownerId, // prevents call when undefined
    });
};

export default useGetDariOwnerDetail;
