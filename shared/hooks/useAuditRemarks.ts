/**
 * AuditRemarks — submit mutation for remarks.
 * Apps provide the API function; this hook wraps it with useMutation.
 */
import { useMutation } from "@tanstack/react-query";

export interface AuditRemarksSubmitPayload {
  remarks: string;
  agentName?: string;
  agentId?: string;
  submittedAt?: string;
}

export function useAuditRemarksSubmit(
  submitFn: (payload: AuditRemarksSubmitPayload) => Promise<unknown>
) {
  return useMutation({
    mutationFn: submitFn,
  });
}
