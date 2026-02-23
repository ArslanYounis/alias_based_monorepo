import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export interface ApplicationDetailResult {
  result: {
    application: {
      applicationNumber: string;
      applicationCreatedDate: string;
      applicationReferenceNumber: string;
    };
    owners: unknown[];
    plot: { plotId: string; plotNumber: string };
    steps: unknown[];
    documents: unknown[];
  };
}

const getApplicationDetail = async (
  applicationId: string
): Promise<ApplicationDetailResult> => {
  const { data } = await axios.get<ApplicationDetailResult>(
    `/ranch/application-detail`,
    { params: { args: applicationId } }
  );
  return data;
};

const emptyResult: ApplicationDetailResult = {
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
};

export function useApplicationDetail(applicationId?: string) {
  return useQuery<ApplicationDetailResult>({
    queryKey: ["applicationDetail", applicationId],
    queryFn: () =>
      applicationId
        ? getApplicationDetail(applicationId)
        : Promise.resolve(emptyResult),
    enabled: !!applicationId,
  });
}
