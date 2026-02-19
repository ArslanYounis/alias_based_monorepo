import { CreditCardIcon } from "lucide-react";
import { createPaymentConfig } from "@shared/configs";
import { Payment } from "./Payment";

export const paymentConfig = createPaymentConfig(Payment, CreditCardIcon);
