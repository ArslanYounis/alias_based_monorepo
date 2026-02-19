import type { ComponentConfig, ControlDefinition, IconType } from "@shared/types/dls.types";
import type { RadioInputProps } from "@shared/types";
import type { ComponentType } from "react";

const controls: {
  [K in keyof Omit<RadioInputProps, "language">]?: ControlDefinition<RadioInputProps>;
} & { fieldKey?: ControlDefinition<RadioInputProps>; bindingData?: ControlDefinition<RadioInputProps>; propsOverride?: ControlDefinition<RadioInputProps> } = {
  fieldKey: { type: ["text"], label: "Field Key", hasArabic: false, isRequired: true, unique: true, defaultValue: "" },
  label: { type: ["text", "code"], label: "Label", hasArabic: true, defaultValue: "Radio Input", defaultValueAr: "Radio Input", defaultCode: "return 'Radio Input'", defaultCodeAr: "return 'Radio Input'" },
  required: { type: ["boolean", "code"], label: "Required?", defaultValue: false, defaultCode: "return false" },
  bindingData: { type: ["bindingData"], label: "Binding Data", isRequired: true },
  onChange: { type: ["code"], label: "onChange", defaultCode: 'console.log("radio group changed", eventData)', isEvent: true, visibility: (props: RadioInputProps) => !props.disabled },
  propsOverride: { type: ["propsOverride"], label: "Props Override", defaultCode: "return {}" },
};

export function createRadioInputConfig(
  Component: ComponentType<RadioInputProps>,
  icon: IconType
): ComponentConfig<RadioInputProps> {
  return { id: "radioInput", icon, name: "Radio Input", Component, controls };
}
