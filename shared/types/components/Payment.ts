export interface PaymentStepInfo {
  result?: {
    tenancyContract?: Record<string, unknown>;
    ranchInsuranceFee?: string;
    ranchInsuranceFeeInWord?: string;
  };
}

export interface PaymentProps {
  applicationId?: string;
  stepInfo?: PaymentStepInfo;
  isStepInfoPending?: boolean;
  isPaymentSubmitting?: boolean;
  onPaymentSubmit?: (eventData: { payload: unknown; meta: unknown }) => void;
  onSubmit?: (eventData: unknown) => void;
  onSuccess?: (eventData: unknown) => void;
  onSaveDraft?: (eventData: unknown) => void;
  language?: "en" | "ar";
}
