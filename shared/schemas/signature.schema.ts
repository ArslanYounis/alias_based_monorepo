import { z } from "zod";

/** Signature output: base64 data URL (e.g. from canvas) */
export const signatureSchema = z.object({
  value: z
    .string()
    .min(1, "Signature is required")
    .refine(
      (s) => s.startsWith("data:") && s.includes("base64"),
      "Signature must be a valid base64 data URL"
    ),
});
export type SignatureSchemaType = z.infer<typeof signatureSchema>;

export const signatureOptionalSchema = z.object({
  value: z.string().optional(),
});
export type SignatureOptionalSchemaType = z.infer<typeof signatureOptionalSchema>;
