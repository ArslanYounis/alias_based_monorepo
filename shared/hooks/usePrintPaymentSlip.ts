import axios from "axios";
import { useMutation } from "@tanstack/react-query";

export interface PrintPaymentSlipPayload {
  applicationPaymentId: number;
}

export interface PrintPaymentSlipArgs {
  payload: PrintPaymentSlipPayload;
  args?: string;
}

export interface PrintPaymentSlipResult {
  result?: {
    downloadUrl?: string;
  };
}

const printPaymentSlip = async ({ payload, args }: PrintPaymentSlipArgs): Promise<PrintPaymentSlipResult> => {
  const { data } = await axios.post("/payment/print-payment-slip", payload, {
    params: { args },
  });
  return data;
};

export const usePrintPaymentSlip = () => {
  return useMutation({
    mutationFn: (args: PrintPaymentSlipArgs) => printPaymentSlip(args),
  });
};
