import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const getApplicationSummary = async (appId?: string) => {
  const { data } = await axios.get(`/ranch/step-info`, {
    params: { args: appId },
  });
  return data;
};

export function useApplicationSummary(appId?: string) {
  return useQuery({
    queryKey: ["applicationSummary", appId],
    queryFn: () => getApplicationSummary(appId),
    enabled: !!appId,
  });
}
