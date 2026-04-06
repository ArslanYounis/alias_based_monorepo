import axios from "axios";
import { useMutation } from "@tanstack/react-query";


interface CalculateRentFeesPayload {
  tenancyContractTypeId: number;
  ranchLandClassificationId: number;
  plotId: number;
}

const calculateRentFees = async (payload: CalculateRentFeesPayload) => {
  const { data } = await axios.post("/tenancy/calculate-rent-fees", payload);
  return data;
};

export const useCalculateRentFees = () => {
  return useMutation({
    mutationFn: (payload: CalculateRentFeesPayload) => calculateRentFees(payload),
  });
};
