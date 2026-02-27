import { useMutation } from "@tanstack/react-query";

export interface CalculateRentFeesParams {
  tenancyContractTypeId: number;
  ranchLandClassificationId: number;
  plotId: number;
}

export interface CalculateRentFeesResult {
  result: {
    rentFeesPerSqMeterUnit: string;
    feeAmount: string;
    amountInWords: string;
  };
}

/**
 * Stub implementation — replace `calculateRentFeesApi` with actual API call.
 * Mirrors ADREC's useCalculateRentFees from hooks/payment/.
 */
const calculateRentFeesApi = async (
  _params: CalculateRentFeesParams
): Promise<CalculateRentFeesResult> => {
  return {
    result: {
      rentFeesPerSqMeterUnit: "0",
      feeAmount: "0",
      amountInWords: "",
    },
  };
};

export const useCalculateRentFees = () => {
  return useMutation({
    mutationFn: calculateRentFeesApi,
  });
};
