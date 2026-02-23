import type { CombinedPaymentForm } from "@shared/schemas";

export interface TenancyContractInfo {
  type?: string;
  contractDate?: string;
  contractNumber?: string;
  ranchTenancyRegistrationFee?: string;
  ranchTenancyRegistrationFeeInWord?: string;
  startDate?: string;
  endDate?: string;
  unitTypeValue?: string;
  requestLandClassificationId: number | string;
  plotId: number | string;
  tenancyContractId: number | string;
  contractDuration?: string | number;
}

export interface PaymentStepInfo {
  result?: {
    tenancyContract?: TenancyContractInfo;
    ranchInsuranceFee?: string | number;
    ranchInsuranceFeeInWord?: string;
  };
}

/** Payload sent to payment submit API (from ADREC usePaymentSubmit). */
export interface PaymentSubmitPayload {
  ranchLandClassificationId: number;
  plotId: number;
  tenancyContractId: number;
  contractDuration: string;
  isFirstYearFreeOfPayment: 0 | 1;
  isSkipPayment: boolean;
  remarks: string;
  exemptSocialAssistanceRecipient: string;
  type: string;
  contractNumber: string;
  contractDate: string;
  contractStartDate: string;
  contractEndDate: string;
  contractRegistrationFees: string;
  contractAmountInWords: string;
  unitType: string;
  tenancyContractType: string;
  annualTenancyAmountPerUnit: string;
  annualTenancyAmount: string;
  annualRentFeesAmountInWords: string;
  insuranceFeeAmount: string;
  insuranceFeeAmountInWords: string;
  isInsurancePayment: 0 | 1;
  isSocialCase: 0 | 1;
  startDate: string;
  endDate: string;
  rentPaymentStartDate: string;
  rentPaymentEndDate: string;
  paymentAmount: number;
}

export interface PaymentProps {
  applicationId?: string;
  stepInfo?: PaymentStepInfo;
  isStepInfoPending?: boolean;
  isPaymentSubmitting?: boolean;
  /** Called with full form values on submit */
  onSubmit?: (data: CombinedPaymentForm) => void;
  /** Save draft (no payload) */
  onSaveDraft?: () => void;
  /** Called when user clicks Submit; receives API payload and meta */
  onPaymentSubmit?: (val: {
    payload: PaymentSubmitPayload;
    meta: {
      applicationId?: string;
      values: CombinedPaymentForm;
      paymentType: "Payment" | "No Payment";
    };
  }) => void;
  onSuccess?: () => void;
  language?: "en" | "ar";
  stepTitles?: string[];
  stepTitles_ar?: string[];
  paymentIcon?: React.ReactNode;
  noPaymentIcon?: React.ReactNode;
}
