import type { ComponentConfig, ControlDefinition, IconType } from "@shared/types/dls.types";
import type { NumberInputProps } from "@shared/types";
import type { ComponentType } from "react";

const controls: {
  [K in keyof Omit<NumberInputProps, "language">]?: ControlDefinition<NumberInputProps>;
} & { fieldKey?: ControlDefinition<NumberInputProps>; propsOverride?: ControlDefinition<NumberInputProps> } = {
  fieldKey: { type: ["text"], label: "Field Key", hasArabic: false, isRequired: true, unique: true, defaultValue: "" },
  label: { type: ["text", "code"], label: "Label", hasArabic: true, defaultValue: "Number", defaultValueAr: "Number", defaultCode: "return 'Number'", defaultCodeAr: "return 'Number'" },
  placeholder: { type: ["text", "code"], label: "Placeholder", hasArabic: true, defaultValue: "Enter...", defaultValueAr: "Enter...", defaultCode: "return 'Enter...'", defaultCodeAr: "return 'Enter...'" },
  required: { type: ["boolean", "code"], label: "Required?", defaultValue: false, defaultCode: "return false" },
  showInfoIcon: { type: ["boolean", "code"], label: "Show Info Icon", defaultValue: false, defaultCode: "return false" },
  tooltipText: { type: ["text", "code"], label: "Tooltip Text", hasArabic: true, defaultValue: "", defaultValueAr: "", defaultCode: "return ''", defaultCodeAr: "return ''" },
  captionLeft: { type: ["text", "code"], label: "Caption Left", hasArabic: true, defaultValue: "", defaultValueAr: "", defaultCode: "return ''", defaultCodeAr: "return ''" },
  captionRight: { type: ["text", "code"], label: "Caption Right", hasArabic: true, defaultValue: "", defaultValueAr: "", defaultCode: "return ''", defaultCodeAr: "return ''" },
  onChange: { type: ["code"], label: "onChange", defaultCode: 'console.log("input changes", eventData)', isEvent: true, visibility: (props: NumberInputProps) => !props.disabled },
  propsOverride: { type: ["propsOverride"], label: "Props Override", defaultCode: "return {}" },
};

export function createNumberConfig(
  Component: ComponentType<NumberInputProps>,
  icon: IconType
): ComponentConfig<NumberInputProps> {
  return { id: "number", icon, name: "Number Field", Component, controls };
}
