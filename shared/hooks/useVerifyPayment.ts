import axios from "axios";
import { useMutation } from "@tanstack/react-query";

export interface VerifyPaymentPayload {
  MunicipalityId: number;
  ApplicationPaymentId: number;
}

export interface VerifyPaymentArgs {
  payload: VerifyPaymentPayload;
  args?: string;
}

const verifyPayment = async ({ payload, args }: VerifyPaymentArgs) => {
  const { data } = await axios.post("/payment/verify-payment", payload, {
    params: { args },
  });
  return data;
};

export const useVerifyPayment = () => {
  return useMutation({
    mutationFn: (args: VerifyPaymentArgs) => verifyPayment(args),
  });
};
