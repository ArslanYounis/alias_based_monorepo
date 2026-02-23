import { z } from "zod";

/** Payment override / payment details form (from paymentOverride) */
export const paymentDetailsSchema = z.object({
  referenceNumber: z.string().min(1, "Reference number is required"),
  receiptDate: z.string().min(1, "Receipt date is required"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((s) => !Number.isNaN(Number(s)), "Amount must be a number")
    .refine((s) => Number(s) >= 0, "Amount must be non-negative"),
  ignoreDuplicate: z.boolean().optional(),
});
export type PaymentDetailsSchemaType = z.infer<typeof paymentDetailsSchema>;

export const paymentDetailsDefaultValues: z.infer<typeof paymentDetailsSchema> = {
  referenceNumber: "",
  receiptDate: "",
  amount: "",
  ignoreDuplicate: false,
};
