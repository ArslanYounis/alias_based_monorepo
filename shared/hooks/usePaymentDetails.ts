/**
 * PaymentDetails (override) — no dedicated API hook; form state is local.
 * Export a placeholder so Tier 3 can import from @shared/hooks consistently.
 * Submit is typically handled by parent or a mutation passed as prop.
 */
import { useMutation } from "@tanstack/react-query";

export interface PaymentDetailsSubmitPayload {
  referenceNumber: string;
  receiptDate: string;
  amount: string;
  ignoreDuplicate?: boolean;
}

export function usePaymentDetailsSubmit(
  submitFn: (payload: PaymentDetailsSubmitPayload) => Promise<unknown>
) {
  return useMutation({
    mutationFn: submitFn,
  });
}
