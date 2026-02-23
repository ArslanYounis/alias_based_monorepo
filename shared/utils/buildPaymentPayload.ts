import type { CombinedPaymentForm } from "@shared/schemas";
import type { PaymentStepInfo, PaymentSubmitPayload } from "@shared/types/components";

export interface RentFeesResult {
  result: {
    rentFeesPerSqMeterUnit: string;
    feeAmount: string;
    amountInWords: string;
  };
  tenancyContractTypeId?: string;
}

/**
 * Build the payload for payment submit API from form values and step info.
 * Matches ADREC payment.tsx basePayload construction.
 */
export function buildPaymentPayload(
  values: CombinedPaymentForm,
  stepInfo: PaymentStepInfo | undefined,
  paymentType: "Payment" | "No Payment",
  tenancyRemarks: string,
  rentFeesResult: RentFeesResult | null
): PaymentSubmitPayload {
  const tc = stepInfo?.result?.tenancyContract;
  const isPayment = paymentType === "Payment";
  const payload: PaymentSubmitPayload = {
    ranchLandClassificationId: Number(tc?.requestLandClassificationId ?? 0),
    plotId: Number(tc?.plotId ?? 0),
    tenancyContractId: Number(tc?.tenancyContractId ?? 0),
    contractDuration: String(tc?.contractDuration ?? ""),
    isFirstYearFreeOfPayment: values?.isFirstYearFreeOfPayment ? 1 : 0,
    isSkipPayment: !isPayment,
    remarks: tenancyRemarks,
    exemptSocialAssistanceRecipient: values?.exemptSocialAssistance ? "true" : "false",
    type: "0",
    contractNumber: values?.contractNumber ?? "",
    contractDate: values?.contractDate ?? "",
    contractStartDate: values?.startDate ?? "",
    contractEndDate: values?.endDate ?? "",
    contractRegistrationFees: String(values?.registrationFees ?? ""),
    contractAmountInWords: values?.amountInWords ?? "",
    unitType: "M",
    tenancyContractType: String(rentFeesResult?.tenancyContractTypeId ?? values?.ranchType ?? "3"),
    annualTenancyAmountPerUnit: String(values?.rentFees ?? ""),
    annualTenancyAmount: String(values?.rentFees ?? ""),
    annualRentFeesAmountInWords: values?.measurementAmountInWords ?? "",
    insuranceFeeAmount: String(values?.insuranceRegistrationFees ?? "") || "",
    insuranceFeeAmountInWords: values?.insuranceAmountInWords ?? "",
    isInsurancePayment: values?.insuranceFee === "Yes" ? 1 : 0,
    isSocialCase: values?.exemptSocialAssistance ? 1 : 0,
    startDate: values?.startDate ?? "",
    endDate: values?.endDate ?? "",
    rentPaymentStartDate: values?.rentPaymentStartDate ?? "",
    rentPaymentEndDate: values?.rentPaymentEndDate ?? "",
    paymentAmount: rentFeesResult?.result?.feeAmount
      ? Number(rentFeesResult.result.feeAmount)
      : Number(values?.paymentAmount) || 0,
  };
  return payload;
}
