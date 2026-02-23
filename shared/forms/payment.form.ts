/**
 * Payment form config: default values, step definitions, and validators.
 * Use with TanStack Form in Payment component (mobile + web).
 */
import {
  ContractSchema,
  MeasurementSchema,
  InsuranceSchema,
  RentSchema,
  type CombinedPaymentForm,
} from "../schemas";

export const PAYMENT_STEP_COUNT = 4;
export type PaymentStepId = 0 | 1 | 2 | 3;

export const PAYMENT_STEP_KEYS = ["contract", "measurement", "insurance", "rent"] as const;

/** Default values for the full payment form (all 4 steps + tenancyRemarks). */
export function getPaymentDefaultValues(): CombinedPaymentForm {
  return {
    tenancyContractType: "new",
    contractDate: "",
    contractNumber: "",
    registrationFees: "",
    amountInWords: "",
    startDate: "",
    endDate: "",
    emergencyNumber: "",
    units: "Square Meter",
    ranchType: "3",
    rentFees: "",
    measurementRegistrationFees: "",
    measurementAmountInWords: "",
    tenancyRemarks: "",
    insuranceFee: "Yes",
    insuranceRegistrationFees: "",
    insuranceAmountInWords: "",
    rentPaymentStartDate: "",
    rentPaymentEndDate: "",
    paymentAmount: "",
    isFirstYearFreeOfPayment: false,
    exemptSocialAssistance: false,
  };
}

/** Validators for each step (for step-by-step validation in UI). */
export const paymentStepValidators = {
  0: ContractSchema,
  1: MeasurementSchema,
  2: InsuranceSchema,
  3: RentSchema,
} as const;

/** Combined validator for full form submit (optional). */
export { ContractSchema, MeasurementSchema, InsuranceSchema, RentSchema };
