import { z } from "zod";

/** Contract step schema (from ADREC payment/helper) */
export const ContractSchema = z.object({
  tenancyContractType: z.enum(["new", "renew"]),
  contractDate: z.string().min(1, "Contract date is required"),
  contractNumber: z.string().min(1, "Contract number is required"),
  registrationFees: z.string().min(1, "Registration fees are required"),
  amountInWords: z.string().min(1, "Amount in words is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  emergencyNumber: z.string().min(1, "Emergency number is required"),
});
export type ContractSchemaType = z.infer<typeof ContractSchema>;

/** Measurement step schema */
export const MeasurementSchema = z.object({
  units: z.enum(["Square Feet", "Square Meter"], {
    required_error: "Please select a unit of measurement",
  }),
  ranchType: z.enum(["3", "4", "5"], {
    required_error: "Please select a ranch type",
  }),
  rentFees: z.string().min(1, "Rent fees are required"),
  measurementRegistrationFees: z.string().min(1, "Registration fees are required"),
  measurementAmountInWords: z.string().min(1, "Amount in words is required"),
  tenancyRemarks: z.string().optional(),
});
export type MeasurementSchemaType = z.infer<typeof MeasurementSchema>;

/** Insurance step schema */
export const InsuranceSchema = z.object({
  insuranceFee: z.enum(["Yes", "No"], {
    required_error: "Please select an insurance fee",
  }),
  insuranceRegistrationFees: z.string().min(1, "Registration fees are required"),
  insuranceAmountInWords: z.string().min(1, "Amount in words is required"),
});
export type InsuranceSchemaType = z.infer<typeof InsuranceSchema>;

/** Rent step schema */
export const RentSchema = z.object({
  insuranceFee: z.enum(["Yes", "No"], {
    required_error: "Please select an insurance fee option",
  }),
  rentPaymentStartDate: z.string().min(1, "Rent payment start date is required"),
  rentPaymentEndDate: z.string().min(1, "Rent payment end date is required"),
  paymentAmount: z.string().min(1, "Payment amount is required"),
  isFirstYearFreeOfPayment: z.boolean().optional(),
  exemptSocialAssistance: z.boolean().optional(),
});
export type RentSchemaType = z.infer<typeof RentSchema>;

/** Combined payment form (all steps + optional tenancyRemarks) */
export type CombinedPaymentForm = z.infer<typeof ContractSchema> &
  z.infer<typeof MeasurementSchema> &
  z.infer<typeof InsuranceSchema> &
  z.infer<typeof RentSchema> & {
    tenancyRemarks?: string;
  };
