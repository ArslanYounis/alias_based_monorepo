/**
 * AuditRemarks form config.
 * Use with TanStack Form in AuditRemarks component (mobile + web).
 */
import {
  auditRemarksSchema,
  auditRemarksDefaultValues,
  type AuditRemarksSchemaType,
} from "../schemas";

export function getAuditRemarksDefaultValues(): AuditRemarksSchemaType {
  return { ...auditRemarksDefaultValues };
}

export { auditRemarksSchema, auditRemarksDefaultValues };
