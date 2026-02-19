import type { ComponentConfig, ControlDefinition, IconType } from "@shared/types/dls.types";
import type { PhoneInputProps } from "@shared/types";
import type { ComponentType } from "react";

const controls: {
  [K in keyof Omit<PhoneInputProps, "language">]?: ControlDefinition<PhoneInputProps>;
} & { fieldKey?: ControlDefinition<PhoneInputProps>; propsOverride?: ControlDefinition<PhoneInputProps> } = {
  fieldKey: { type: ["text"], label: "Field Key", hasArabic: false, isRequired: true, unique: true, defaultValue: "" },
  label: { type: ["text", "code"], label: "Label", hasArabic: true, defaultValue: "input label", defaultValueAr: "input label", defaultCode: "return 'input label'", defaultCodeAr: "return 'input label'" },
  placeholder: { type: ["text", "code"], label: "Placeholder", hasArabic: true, defaultValue: "placeholder", defaultValueAr: "placeholder", defaultCode: "return 'placeholder'", defaultCodeAr: "return 'placeholder'" },
  required: { type: ["boolean", "code"], label: "Required?", defaultValue: false, defaultCode: "return false" },
  showInfoIcon: { type: ["boolean", "code"], label: "Show Info Icon", defaultValue: false, defaultCode: "return false" },
  tooltipText: { type: ["text", "code"], label: "Tooltip Text", hasArabic: true, defaultValue: "", defaultValueAr: "", defaultCode: "return ''", defaultCodeAr: "return ''" },
  captionLeft: { type: ["text", "code"], label: "Caption Left", hasArabic: true, defaultValue: "", defaultValueAr: "", defaultCode: "return ''", defaultCodeAr: "return ''" },
  captionRight: { type: ["text", "code"], label: "Caption Right", hasArabic: true, defaultValue: "", defaultValueAr: "", defaultCode: "return ''", defaultCodeAr: "return ''" },
  phoneCode: { type: ["text", "code"], label: "Phone Code", defaultValue: "+971", defaultCode: "return '+971'" },
  onChange: { type: ["code"], label: "onChange", defaultCode: 'console.log("phone value changed", eventData)', isEvent: true, visibility: (props: PhoneInputProps) => !props.disabled },
  propsOverride: { type: ["propsOverride"], label: "Props Override", defaultCode: "return {}" },
};

export function createPhoneInputConfig(
  Component: ComponentType<PhoneInputProps>,
  icon: IconType
): ComponentConfig<PhoneInputProps> {
  return { id: "phoneInput", icon, name: "Phone Input", Component, controls };
}
