import type { ComponentConfig, ControlDefinition, IconType } from "@shared/types/dls.types";
import type { RadioFieldProps } from "@shared/types";
import type { ComponentType } from "react";

const controls: {
  [K in keyof Omit<
    RadioFieldProps,
    "language"
  >]?: ControlDefinition<RadioFieldProps>;
} & {
  fieldKey?: ControlDefinition<RadioFieldProps>;
  propsOverride?: ControlDefinition<RadioFieldProps>;
} = {
  fieldKey: {
    type: ["text"],
    label: "Field Key",
    hasArabic: false,
    isRequired: true,
    unique: true,
    defaultValue: "",
  },
  label: {
    type: ["text", "code"],
    label: "Label",
    hasArabic: true,
    defaultValue: "RadioField",
    defaultValueAr: "RadioField",
    defaultCode: "return 'RadioField'",
    defaultCodeAr: "return 'RadioField'",
  },
  disabled: {
    type: ["boolean", "code"],
    label: "Disabled?",
    defaultValue: false,
    defaultCode: "return false",
  },
  onChange: {
    type: ["code"],
    label: "onChange",
    defaultCode: 'console.log("input changes", eventData)',
    isEvent: true,
    visibility: (props) => !props.disabled,
  },
};

export function createRadioFieldConfig(
  Component: ComponentType<RadioFieldProps>,
  icon: IconType
): ComponentConfig<RadioFieldProps> {
  return { id: "radioField", icon, name: "Radio Field", Component, controls };
}
