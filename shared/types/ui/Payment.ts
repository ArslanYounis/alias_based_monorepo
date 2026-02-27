/**
 * Payload sent to the payment submit API.
 * Mirrors ADREC's PaymentSubmitPayload from hooks/payment/usePaymentSubmit.
 */
export interface PaymentSubmitPayload {
  ranchLandClassificationId: number;
  plotId: number;
  tenancyContractId: number;
  contractDuration: string;
  isFirstYearFreeOfPayment: number;
  isSkipPayment: boolean;
  remarks: string;
  exemptSocialAssistanceRecipient: string;
  type: string;
  contractNumber?: string;
  contractDate?: string;
  contractStartDate?: string;
  contractEndDate?: string;
  contractRegistrationFees: string;
  contractAmountInWords?: string;
  unitType: string;
  tenancyContractType: string;
  annualTenancyAmountPerUnit: string;
  annualTenancyAmount: string;
  annualRentFeesAmountInWords?: string;
  insuranceFeeAmount: string;
  insuranceFeeAmountInWords: string;
  isInsurancePayment: number;
  isSocialCase: number;
  startDate?: string;
  endDate?: string;
  rentPaymentStartDate?: string;
  rentPaymentEndDate?: string;
  paymentAmount: number;
}
