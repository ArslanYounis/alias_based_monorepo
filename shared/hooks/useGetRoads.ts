import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface Roads {
  municipalityId: number;
  roadId: number;
  roadNameA: string;
  roadNameE: string;
  roadNumber: number;
  urlArgs: unknown | null;
}

const getRoads = async (communityId: number): Promise<Roads[]> => {
  const { data } = await axios.get<Roads[]>(`/roads/${communityId}`);
  return data;
};

export const useGetRoads = (communityId?: number) => {
  const query = useQuery<Roads[]>({
    queryKey: ["roads", communityId],
    queryFn: () => {
      if (!communityId) return Promise.resolve([]);
      return getRoads(communityId);
    },
    enabled: !!communityId,
  });

  const options = (query.data || []).map((r) => ({
    label: r.roadNameE,
    label_ar: r.roadNameA,
    value: r.roadId.toString(),
  }));

  return { ...query, options };
};
