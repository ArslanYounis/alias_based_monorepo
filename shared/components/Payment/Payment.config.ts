import type {
  ComponentConfig,
  IconType,
} from "@shared/types/dls.types";
import type { PaymentProps } from "./Payment";
import type { ComponentType } from "react";

const controls: ComponentConfig<PaymentProps>["controls"] = {
  applicationId: {
    type: ["text", "code"],
    label: "Application ID",
    hasArabic: false,
    defaultValue: "",
    defaultCode: 'return ""',
  },
  stepInfo: {
    type: ["code"],
    label: "Step Info (API data)",
    defaultValue: {
      result: {
        tenancyContract: {
          type: "New Tenancy",
          contractDate: "2024-01-01",
          contractNumber: "CONTRACT-123",
          ranchTenancyRegistrationFee: "500",
          ranchTenancyRegistrationFeeInWord: "Five Hundred",
          startDate: "2024-01-01",
          endDate: "2024-12-31",
          unitTypeValue: "M",
          requestLandClassificationId: 1,
          plotId: 1,
          tenancyContractId: 1,
          contractDuration: 12,
        },
        ranchInsuranceFee: "100",
        ranchInsuranceFeeInWord: "One Hundred",
      },
    },
    defaultCode: `return {
  result: {
    tenancyContract: {
      type: "New Tenancy",
      contractDate: "2024-01-01",
      contractNumber: "CONTRACT-123",
      ranchTenancyRegistrationFee: "500",
      ranchTenancyRegistrationFeeInWord: "Five Hundred",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      unitTypeValue: "M",
      requestLandClassificationId: 1,
      plotId: 1,
      tenancyContractId: 1,
      contractDuration: 12,
    },
    ranchInsuranceFee: "100",
    ranchInsuranceFeeInWord: "One Hundred",
  },
};`,
  },
  isStepInfoPending: {
    type: ["boolean", "code"],
    label: "Is Step Info Loading",
    defaultValue: false,
    defaultCode: "return false",
  },
  isPaymentSubmitting: {
    type: ["boolean", "code"],
    label: "Is Payment Submitting",
    defaultValue: false,
    defaultCode: "return false",
  },
  onPaymentSubmit: {
    type: ["code"],
    label: "On Payment Submit (API payload)",
    defaultCode:
      "console.log('payment payload + meta', eventData.payload, eventData.meta)",
    isEvent: true,
  },
  onSubmit: {
    type: ["code"],
    label: "On Submit",
    defaultCode: "console.log('payment submit', eventData)",
    isEvent: true,
  },
  onSuccess: {
    type: ["code"],
    label: "On Payment Success",
    defaultCode: "console.log('payment submitted', eventData)",
    isEvent: true,
  },
  onSaveDraft: {
    type: ["code"],
    label: "On saving as draft",
    defaultCode: "console.log('payment drafted', eventData)",
    isEvent: true,
  },
  propsOverride: {
    type: ["propsOverride"],
    label: "Props Override",
    defaultCode: "return {}",
  },
};

export function createPaymentConfig(
  Component: ComponentType<PaymentProps>,
  icon: IconType
): ComponentConfig<PaymentProps> {
  return {
    id: "payment",
    icon,
    name: "Payment",
    Component,
    controls,
  };
}
