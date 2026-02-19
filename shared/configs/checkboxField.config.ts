import type { ComponentConfig, ControlDefinition, IconType } from "@shared/types/dls.types";
import type { CheckboxFieldProps } from "@shared/types";
import type { ComponentType } from "react";

const controls: {
  [K in keyof Omit<CheckboxFieldProps, "language">]?: ControlDefinition<CheckboxFieldProps>;
} & { fieldKey?: ControlDefinition<CheckboxFieldProps>; propsOverride?: ControlDefinition<CheckboxFieldProps> } = {
  fieldKey: { type: ["text"], label: "Field Key", hasArabic: false, isRequired: true, unique: true, defaultValue: "" },
  label: { type: ["text", "code"], label: "Label", hasArabic: true, defaultValue: "CheckboxField", defaultValueAr: "CheckboxField", defaultCode: "return 'CheckboxField'", defaultCodeAr: "return 'CheckboxField'" },
  required: { type: ["boolean", "code"], label: "Required?", defaultValue: false, defaultCode: "return false" },
  onChange: { type: ["code"], label: "onChange", defaultCode: 'console.log("checkbox changed", eventData)', isEvent: true, visibility: (props: CheckboxFieldProps) => !props.disabled },
  propsOverride: { type: ["propsOverride"], label: "Props Override", defaultCode: "return {}" },
};

export function createCheckboxFieldConfig(
  Component: ComponentType<CheckboxFieldProps>,
  icon: IconType
): ComponentConfig<CheckboxFieldProps> {
  return { id: "checkboxField", icon, name: "Checkbox Field", Component, controls };
}
