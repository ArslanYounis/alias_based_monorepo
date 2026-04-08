/* istanbul ignore file */
import type { IconType, ComponentConfig } from "@shared/types/dls.types";
import PaymentDetails, { type PaymentDetailsProps } from "./PaymentDetails";

const createPaymentDetailsConfig = (
  ReceiptTextIcon: IconType
): ComponentConfig<PaymentDetailsProps> => ({
  id: "paymentDetail",
  icon: ReceiptTextIcon,
  name: "Payment Detail",
  Component: PaymentDetails,
  controls: {
    applicationId: {
      type: ["text", "code"],
      label: "Application ID",
      hasArabic: false,
      defaultValue: "",
      defaultCode: 'return ""',
    },
    variant: {
      type: ["select", "code"],
      label: "Variant",
      options: ["small", "medium", "large"],
      defaultValue: "medium",
      defaultCode: "return 'medium'",
    },
    payments: {
      type: ["code"],
      label: "Payments Data",
      defaultValue: [
        {
          applicationPaymentId: 1,
          municipalityId: 101,
          paymentDescriptionE: "Building Permit Fee",
          paymentDescriptionA: "رسوم تصريح البناء",
          municipalityNameE: "Dubai Municipality",
          municipalityNameA: "بلدية دبي",
          paidByName: "John Doe",
          receiptNumber: "",
          receiptDate: "",
          amountDue: "500 AED",
          amountInWords: "Five Hundred Dirhams",
          vatAmount: "25 AED",
        },
        {
          applicationPaymentId: 2,
          municipalityId: 102,
          paymentDescriptionE: "Inspection Fee",
          paymentDescriptionA: "رسوم التفتيش",
          municipalityNameE: "Abu Dhabi Municipality",
          municipalityNameA: "بلدية أبوظبي",
          paidByName: "John Doe",
          receiptNumber: "REC123",
          receiptDate: "2025-02-01",
          amountDue: "300 AED",
          amountInWords: "Three Hundred Dirhams",
          vatAmount: "15 AED",
        },
      ],
      defaultCode: `return [
  {
    applicationPaymentId: 1,
    municipalityId: 101,
    paymentDescriptionE: "Building Permit Fee",
    paymentDescriptionA: "رسوم تصريح البناء",
    municipalityNameE: "Dubai Municipality",
    municipalityNameA: "بلدية دبي",
    paidByName: "John Doe",
    receiptNumber: "",
    receiptDate: "",
    amountDue: "500 AED",
    amountInWords: "Five Hundred Dirhams",
    vatAmount: "25 AED",
  },
  {
    applicationPaymentId: 2,
    municipalityId: 102,
    paymentDescriptionE: "Inspection Fee",
    paymentDescriptionA: "رسوم التفتيش",
    municipalityNameE: "Abu Dhabi Municipality",
    municipalityNameA: "بلدية أبوظبي",
    paidByName: "John Doe",
    receiptNumber: "REC123",
    receiptDate: "2025-02-01",
    amountDue: "300 AED",
    amountInWords: "Three Hundred Dirhams",
    vatAmount: "15 AED",
  },
]`,
    },
    showButtons: {
      type: ["boolean", "code"],
      label: "Show Buttons",
      defaultValue: false,
      defaultCode: "return false",
    },
    buttons: {
      type: ["code"],
      label: "Buttons",
      defaultValue: [],
      defaultCode: `return [
  {
    title: "Continue Later",
    title_ar: "استمرار لاحقًا",
    type: "delete",
    onClick: () => console.log("Continue later clicked")
  },
  {
    title: "Back",
    title_ar: "رجوع",
    type: "secondary",
    onClick: () => console.log("Back clicked")
  },
  {
    title: "Submit",
    title_ar: "إرسال",
    type: "primary",
    disabled: true,
    onClick: () => console.log("Submit clicked")
  }
]`,
    },
    drawerSize: {
      type: ["select", "code"],
      label: "Drawer Size",
      options: ["layer1", "layer2", "layer3"],
      defaultValue: "layer1",
      defaultCode: "return 'layer1'",
    },
    isLoading: {
      type: ["boolean", "code"],
      label: "Loading",
      defaultValue: false,
      defaultCode: "return false",
    },
    paymentOverrideTitle: {
      type: ["text", "code"],
      label: "Payment Override Title (EN)",
      hasArabic: true,
      defaultValue: "Payment Override",
      defaultCode: 'return "Payment Override"',
    },
    paymentOverrideDescription: {
      type: ["text", "code"],
      label: "Payment Override Description (EN)",
      hasArabic: true,
      defaultValue:
        "Search for the customer who wants to have the ranch land allocated to them.",
      defaultCode:
        'return "Search for the customer who wants to have the ranch land allocated to them."',
    },
    onOverrideComplete: {
      type: ["code"],
      label: "On Override Complete",
      defaultCode: "console.log('override', eventData)",
      isEvent: true,
    },
    onVerifyComplete: {
      type: ["code"],
      label: "On Verify Complete",
      defaultCode: "console.log('verify', eventData)",
      isEvent: true,
    },
    propsOverride: {
      type: ["propsOverride"],
      label: "Props Override",
      defaultCode: "return {}",
    },
  },
});

export default createPaymentDetailsConfig;
