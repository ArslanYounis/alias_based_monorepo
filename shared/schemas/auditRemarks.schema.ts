import { z } from "zod";

export const auditRemarksSchema = z.object({
  remarks: z.string().min(1, "Remarks are required"),
  agentName: z.string().optional(),
  agentId: z.string().optional(),
  submittedAt: z.string().optional(),
});
export type AuditRemarksSchemaType = z.infer<typeof auditRemarksSchema>;

export const auditRemarksDefaultValues: z.infer<typeof auditRemarksSchema> = {
  remarks: "",
  agentName: "",
  agentId: "",
  submittedAt: "",
};
