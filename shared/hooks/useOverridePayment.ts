import axios from "axios";
import { useMutation } from "@tanstack/react-query";

export interface OverridePaymentPayload {
  applicationPaymentId: number;
  receiptNumber: string;
  receiptDate: string;
  amount: string;
  duplicateReceiptNumber: boolean;
}

export interface OverridePaymentArgs {
  payload: OverridePaymentPayload;
  args?: string;
}

const overridePayment = async ({ payload, args }: OverridePaymentArgs) => {
  const { data } = await axios.post("/payment/override-payment", payload, {
    params: { args },
  });
  return data;
};

export const useOverridePayment = () => {
  return useMutation({
    mutationFn: (args: OverridePaymentArgs) => overridePayment(args),
  });
};
