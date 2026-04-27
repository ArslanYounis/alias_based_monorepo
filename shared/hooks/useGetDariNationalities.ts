import axios from "axios";
import { useQuery } from "@tanstack/react-query";


interface DariNationalities {
    nationalityid: number;
    nationalitynameAr: string;
    nationalitynameEn: string;
    nationalityType: number;
    countryNameAr: string;
    countryNameEn: string;
    moiID: number;
}

interface DariNationalitiesResponse {
    nationalities: DariNationalities[];
}

const getDariNationalities = async (): Promise<DariNationalities[]> => {
    const { data } = await axios.get<DariNationalitiesResponse>(
        `dari/authentication/nationalities`
    );

    return data.nationalities;
};

export const useGetDariNationalities = () => {
    const query = useQuery<DariNationalities[]>({
        queryKey: ["dari-nationalities"],
        queryFn: getDariNationalities,
    });

    const options = Array.isArray(query.data)
        ? query.data.map((d) => ({
            label: d.nationalitynameEn,
            label_ar: d.nationalitynameAr,
            value: d.nationalityid.toString(),
        }))
        : [];

    return {
        ...query,
        options,
    };
};
