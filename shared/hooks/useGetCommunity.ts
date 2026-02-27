import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface Community {
  businessFlags: unknown | null;
  communityId: number;
  communityNameA: string;
  communityNameE: string;
  communityNumber: number;
  districtId: number;
  migNote: number;
  municipalityId: number;
  plotAppraisalGroupId: number;
  sectorId: number;
  urlArgs: unknown | null;
}

const getCommunity = async (districtId: number): Promise<Community[]> => {
  const { data } = await axios.get<Community[]>(`/community/${districtId}`);
  return data;
};

export const useGetCommunity = (districtId?: number) => {
  const query = useQuery<Community[]>({
    queryKey: ["community", districtId],
    queryFn: () => {
      if (!districtId) return Promise.resolve([]);
      return getCommunity(districtId);
    },
    enabled: !!districtId,
  });

  const options = (query.data || []).map((c) => ({
    label: c.communityNameE,
    label_ar: c.communityNameA,
    value: c.communityId.toString(),
  }));

  return { ...query, options };
};
