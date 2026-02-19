import type {
  ComponentConfig,
  ControlDefinition,
  IconType,
} from "@shared/types/dls.types";
import type { PaymentDetailsProps } from "@shared/types";
import type { ComponentType } from "react";

const controls: {
  [K in keyof Omit<PaymentDetailsProps, "language">]?: ControlDefinition<PaymentDetailsProps>;
} & {
  propsOverride?: ControlDefinition<PaymentDetailsProps>;
} = {
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
    defaultValue: [],
    defaultCode: "return []",
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
    defaultCode: "return []",
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
    hasArabic: false,
    defaultValue: "Payment Override",
    defaultCode: 'return "Payment Override"',
  },
  paymentOverrideTitle_ar: {
    type: ["text", "code"],
    label: "Payment Override Title (AR)",
    hasArabic: true,
    defaultValue: "تجاوز الدفع",
    defaultCode: 'return "تجاوز الدفع"',
  },
  paymentOverrideDescription: {
    type: ["text", "code"],
    label: "Payment Override Description (EN)",
    hasArabic: false,
    defaultValue: "Search for the customer who wants to have the ranch land allocated to them.",
    defaultCode:
      'return "Search for the customer who wants to have the ranch land allocated to them."',
  },
  paymentOverrideDescription_ar: {
    type: ["text", "code"],
    label: "Payment Override Description (AR)",
    hasArabic: true,
    defaultValue: "ابحث عن العميل الذي يرغب في تخصيص أرض المزرعة له.",
    defaultCode: 'return "ابحث عن العميل الذي يرغب في تخصيص أرض المزرعة له."',
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
};

export function createPaymentDetailsConfig(
  Component: ComponentType<PaymentDetailsProps>,
  icon: IconType
): ComponentConfig<PaymentDetailsProps> {
  return {
    id: "paymentDetail",
    icon,
    name: "Payment Detail",
    Component,
    controls,
  };
}
