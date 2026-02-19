import { ReceiptTextIcon } from "lucide-react";
import { createPaymentDetailsConfig } from "@shared/configs";
import { PaymentDetails } from "./PaymentDetails";

export const paymentDetailsConfig = createPaymentDetailsConfig(
  PaymentDetails,
  ReceiptTextIcon
);
