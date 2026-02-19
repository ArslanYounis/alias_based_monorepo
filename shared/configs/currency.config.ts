import type { ComponentConfig, ControlDefinition, IconType } from "@shared/types/dls.types";
import type { CurrencyInputProps } from "@shared/types";
import type { ComponentType } from "react";

const controls: {
  [K in keyof Omit<CurrencyInputProps, "language">]?: ControlDefinition<CurrencyInputProps>;
} & { fieldKey?: ControlDefinition<CurrencyInputProps>; propsOverride?: ControlDefinition<CurrencyInputProps> } = {
  fieldKey: { type: ["text"], label: "Field Key", hasArabic: false, isRequired: true, unique: true, defaultValue: "" },
  label: { type: ["text", "code"], label: "Label", hasArabic: true, defaultValue: "Currency", defaultValueAr: "Currency", defaultCode: "return 'Currency'", defaultCodeAr: "return 'Currency'" },
  placeholder: { type: ["text", "code"], label: "Placeholder", hasArabic: true, defaultValue: "Enter...", defaultValueAr: "Enter...", defaultCode: "return 'Enter...'", defaultCodeAr: "return 'Enter...'" },
  required: { type: ["boolean", "code"], label: "Required?", defaultValue: false, defaultCode: "return false" },
  showInfoIcon: { type: ["boolean", "code"], label: "Show Info Icon", defaultValue: false, defaultCode: "return false" },
  tooltipText: { type: ["text", "code"], label: "Tooltip Text", hasArabic: true, defaultValue: "", defaultValueAr: "", defaultCode: "return ''", defaultCodeAr: "return ''" },
  captionLeft: { type: ["text", "code"], label: "Caption Left", hasArabic: true, defaultValue: "", defaultValueAr: "", defaultCode: "return ''", defaultCodeAr: "return ''" },
  captionRight: { type: ["text", "code"], label: "Caption Right", hasArabic: true, defaultValue: "", defaultValueAr: "", defaultCode: "return ''", defaultCodeAr: "return ''" },
  currencySymbol: { type: ["select", "code"], label: "Currency Symbol", options: ["AED", "USD", "EUR", "GBP", "SAR", "QAR", "OMR", "KWD", "BHD"], defaultValue: "AED", defaultCode: "return 'AED'" },
  onChange: { type: ["code"], label: "onChange", defaultCode: 'console.log("input changes", eventData)', isEvent: true, visibility: (props: CurrencyInputProps) => !props.disabled },
  propsOverride: { type: ["propsOverride"], label: "Props Override", defaultCode: "return {}" },
};

export function createCurrencyConfig(
  Component: ComponentType<CurrencyInputProps>,
  icon: IconType
): ComponentConfig<CurrencyInputProps> {
  return { id: "currency", icon, name: "Currency", Component, controls };
}
