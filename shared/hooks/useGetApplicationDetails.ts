import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import type { ApplicationDetailsApiResponse } from "../types";

const getApplicationDetails = async (
  applicationId: string
): Promise<ApplicationDetailsApiResponse> => {
  const { data } = await axios.get<ApplicationDetailsApiResponse>(
    "/ranch/application-detail",
    { params: { args: applicationId } }
  );
  return data;
};

export const useGetApplicationDetails = (applicationId?: string) => {
  return useQuery<ApplicationDetailsApiResponse>({
    queryKey: ["applicationDetails", applicationId],
    queryFn: () => {
      if (!applicationId)
        return Promise.resolve({
          result: {
            application: {
              applicationNumber: "",
              applicationCreatedDate: "",
              applicationReferenceNumber: "",
            },
            owners: [],
            plot: { plotId: "", plotNumber: "" },
            steps: [],
            documents: [],
          },
        });
      return getApplicationDetails(applicationId);
    },
    enabled: !!applicationId,
  });
};
