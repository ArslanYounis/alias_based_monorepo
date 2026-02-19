import type { ComponentConfig, ControlDefinition, IconType } from "@shared/types/dls.types";
import type { CheckboxInputProps } from "@shared/types";
import type { ComponentType } from "react";

const controls: {
  [K in keyof Omit<CheckboxInputProps, "language">]?: ControlDefinition<CheckboxInputProps>;
} & { fieldKey?: ControlDefinition<CheckboxInputProps>; bindingData?: ControlDefinition<CheckboxInputProps>; propsOverride?: ControlDefinition<CheckboxInputProps> } = {
  fieldKey: { type: ["text"], label: "Field Key", hasArabic: false, isRequired: true, unique: true, defaultValue: "" },
  label: { type: ["text", "code"], label: "Label", hasArabic: true, defaultValue: "Checkbox Input", defaultValueAr: "Checkbox Input", defaultCode: "return 'Checkbox Input'", defaultCodeAr: "return 'Checkbox Input'" },
  required: { type: ["boolean", "code"], label: "Required?", defaultValue: false, defaultCode: "return false" },
  bindingData: { type: ["bindingData"], label: "Binding Data", isRequired: true },
  onChange: { type: ["code"], label: "onChange", defaultCode: 'console.log("checkbox group changed", eventData)', isEvent: true, visibility: (props: CheckboxInputProps) => !props.disabled },
  propsOverride: { type: ["propsOverride"], label: "Props Override", defaultCode: "return {}" },
};

export function createCheckboxInputConfig(
  Component: ComponentType<CheckboxInputProps>,
  icon: IconType
): ComponentConfig<CheckboxInputProps> {
  return { id: "checkboxInput", icon, name: "Checkbox Input", Component, controls };
}
