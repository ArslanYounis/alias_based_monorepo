import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface Decree {
    comments?: string;
    decreeDate?: string;
    decreeDateFormat?: string;
    decreeId?: number;
    decreeNumber?: string;
    decreeSourceNameA?: string;
    decreeSourceNameE?: string;
    decreeSourceTypeNameA?: string;
    decreeSourceTypeNameE?: string;
}

interface DecreeDetailsResponse {
    result: {
        decree: Decree;
    };
}

const decreeDetail = async (
    id: string | number
): Promise<DecreeDetailsResponse["result"]> => {
    const response = await axios.get<DecreeDetailsResponse>(
        `/decree/allotment-name/${id}`
    );

    return response.data.result;
};

export const useDecreeDetails = (id?: string) => {
    return useQuery({
        queryKey: ["decree-detail", id],
        queryFn: () => decreeDetail(id!),
        enabled: !!id,
    });
};
