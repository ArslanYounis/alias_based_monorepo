/**
 * PaymentDetails (override) form config.
 * Use with TanStack Form in PaymentDetails component (mobile + web).
 */
import {
  paymentDetailsSchema,
  paymentDetailsDefaultValues,
  type PaymentDetailsSchemaType,
} from "../schemas";

export function getPaymentDetailsDefaultValues(): PaymentDetailsSchemaType {
  return { ...paymentDetailsDefaultValues };
}

export { paymentDetailsSchema, paymentDetailsDefaultValues };
