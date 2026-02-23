import axios from "axios";
import { useQuery } from "@tanstack/react-query";

/**
 * Fetches step info for the Payment flow (contract, measurement, etc.).
 * Requires axios default baseURL to be set by the app.
 */
const getStepInfo = async (args?: string) => {
  const { data } = await axios.get(`/ranch/step-info`, {
    params: { args },
  });
  return data;
};

export function usePayment(args?: string) {
  return useQuery({
    queryKey: ["paymentStepInfo", args],
    queryFn: () => getStepInfo(args),
    enabled: !!args,
  });
}
