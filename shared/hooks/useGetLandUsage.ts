import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface LandUsage {
  buildingPercent: number;
  businessFlags: null | string;
  colorCode: string;
  joinedLandUseA: string;
  joinedLandUseE: string;
  landuseConst: string;
  landuseId: number;
  landuseNameA: string;
  landuseNameE: string;
  lucCode: string;
  mepsIdentifier: string;
  migNote: string | null;
  migNoteL: string;
  migNoteLm: string;
  municipalityId: number;
  parentLanduseId: number;
  urlArgs: unknown | null;
}

const getLandUsage = async (municipalityId: number): Promise<LandUsage[]> => {
  const { data } = await axios.get<LandUsage[]>(`/land-usage/${municipalityId}`);
  return data;
};

export const useGetLandUsage = (municipalityId?: number) => {
  const query = useQuery<LandUsage[]>({
    queryKey: ["land-usage", municipalityId],
    queryFn: () => {
      if (!municipalityId) return Promise.resolve([]);
      return getLandUsage(municipalityId);
    },
    enabled: !!municipalityId,
  });

  const options = (query.data || []).map((m) => ({
    label: m.landuseNameE,
    label_ar: m.landuseNameA,
    value: m.landuseId.toString(),
  }));

  return { ...query, options };
};
