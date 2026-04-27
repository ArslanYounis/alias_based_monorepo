import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface Municipality {
    communityID: number;
    communityNameAr: string;
    communityNameEn: string;
    communityNumber: string;
    districtID: number;
    districtNameAr: string;
    districtNameEn: string;
    districtNumber: string;
    municipalityID: number;
    municipalityNameEn: string;
    municipalityNameAr: string;
    roadID: number;
    roadNameAr: string;
    roadNameEn: string;
    roadNumber: string;
    userId: string;
}

interface MunicipalityResponse {
    locations: Municipality[];
}

const getDariMunicipality = async (): Promise<Municipality[]> => {
    try {
        const { data } = await axios.get<MunicipalityResponse>(
            "dari/authentication/locations"
        );
        return data?.locations ?? [];
    } catch (error) {
        console.error("Failed to fetch Dari municipalities:", error);
        return [];
    }
};

export const useGetDariMunicipality = () => {
    return useQuery<Municipality[]>({
        queryKey: ["dari-municipalities"],
        queryFn: getDariMunicipality,
    });
};