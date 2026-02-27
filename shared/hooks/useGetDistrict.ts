import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface BusinessFlags {
  [key: string]: boolean | string | number;
}

interface UrlArgs {
  [key: string]: string | number | boolean;
}

interface District {
  districtId: number;
  districtNameA: string;
  districtNameE: string;
  districtNumber: string;
  municipalityId: number;
  zoneId: number;
  businessFlags: BusinessFlags | null;
  migNote: number;
  urlArgs: UrlArgs | null;
}

const getDistricts = async (municipalityId: number): Promise<District[]> => {
  const { data } = await axios.get<District[]>(`/district/${municipalityId}`);
  return data;
};

export const useGetDistrict = (municipalityId?: number) => {
  const query = useQuery<District[]>({
    queryKey: ["districts", municipalityId],
    queryFn: () => {
      if (!municipalityId) return Promise.resolve([]);
      return getDistricts(municipalityId);
    },
    enabled: !!municipalityId,
  });

  const options = (query.data || []).map((d) => ({
    label: d.districtNameE,
    label_ar: d.districtNameA,
    value: d.districtId.toString(),
  }));

  return { ...query, options };
};
