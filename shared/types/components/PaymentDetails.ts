export interface PaymentDetailsPayment {
  applicationPaymentId: number;
  municipalityId: number;
  paymentDescriptionE: string;
  paymentDescriptionA?: string;
  municipalityNameE: string;
  municipalityNameA?: string;
  paidByName: string;
  receiptNumber: string;
  receiptDate: string;
  amountDue: string;
  amountInWords: string;
  vatAmount: string;
}

export interface PaymentDetailsButton {
  title: string;
  title_ar?: string;
  type: "primary" | "secondary" | "delete";
  onClick?: () => void;
  disabled?: boolean;
}

export interface PaymentDetailsProps {
  applicationId?: string;
  variant?: "small" | "medium" | "large";
  payments?: PaymentDetailsPayment[];
  showButtons?: boolean;
  buttons?: PaymentDetailsButton[];
  drawerSize?: "layer1" | "layer2" | "layer3";
  isLoading?: boolean;
  paymentOverrideTitle?: string;
  paymentOverrideTitle_ar?: string;
  paymentOverrideDescription?: string;
  paymentOverrideDescription_ar?: string;
  onOverrideComplete?: (eventData: unknown) => void;
  onVerifyComplete?: (eventData: unknown) => void;
  language?: "en" | "ar";
}
