import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface DariLandUses {
    landUseID: number;
    parentLandUseID: number;
    landUseNameAr: string;
    landUseNameEn: string;
}

interface DariLandUsesResponse {
    landUses: DariLandUses[];
}

const getDariLanduses = async (
    municipalityId: number
): Promise<DariLandUses[]> => {
    const { data } = await axios.get<DariLandUsesResponse>(
        `dari/authentication/land-uses?municipalityId=${municipalityId}`
    );

    return data?.landUses || [];
};

export const useGetDariLanduses = (municipalityId?: number) => {
    const query = useQuery<DariLandUses[]>({
        queryKey: ["dari-land-usage", municipalityId],
        queryFn: () => {
            if (!municipalityId) return Promise.resolve([]);
            return getDariLanduses(municipalityId);
        },
        enabled: !!municipalityId,
    });

    return query;
};