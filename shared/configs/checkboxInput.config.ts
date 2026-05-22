import type { ComponentConfig, ControlDefinition, IconType } from "@shared/types/dls.types";
import type { CheckboxInputProps } from "@shared/types";
import type { ComponentType } from "react";

const controls: {
  [K in keyof Omit<
    CheckboxInputProps,
    "language"
  >]?: ControlDefinition<CheckboxInputProps>;
} & {
  fieldKey?: ControlDefinition<CheckboxInputProps>;
  bindingData?: ControlDefinition<CheckboxInputProps>;
  propsOverride?: ControlDefinition<CheckboxInputProps>;
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
    defaultValue: "Checkbox Input",
    defaultValueAr: "Checkbox Input",
    defaultCode: "return 'Checkbox Input'",
    defaultCodeAr: "return 'Checkbox Input'",
  },
  disabled: {
    type: ["boolean", "code"],
    label: "Disabled?",
    defaultValue: false,
    defaultCode: "return false",
  },
  required: {
    type: ["boolean", "code"],
    label: "Required?",
    defaultValue: false,
    defaultCode: "return false",
  },
  showInfoIcon: {
    type: ["boolean", "code"],
    label: "Show Info Icon",
    defaultValue: false,
    defaultCode: "return false",
  },
  tooltipText: {
    type: ["text", "code"],
    label: "Tooltip Text",
    hasArabic: true,
    defaultValue: "",
    defaultValueAr: "",
    defaultCode: "return ''",
    defaultCodeAr: "return ''",
  },
  captionLeft: {
    type: ["text", "code"],
    label: "Caption Left",
    hasArabic: true,
    defaultValue: "",
    defaultValueAr: "",
    defaultCode: "return ''",
    defaultCodeAr: "return ''",
  },
  captionRight: {
    type: ["text", "code"],
    label: "Caption Right",
    hasArabic: true,
    defaultValue: "",
    defaultValueAr: "",
    defaultCode: "return ''",
    defaultCodeAr: "return ''",
  },
  bindingData: {
    type: ["bindingData"],
    label: "Binding Data",
    isRequired: true,
  },
  onChange: {
    type: ["code"],
    label: "onChange",
    defaultCode: 'console.log("input changes", eventData)',
    isEvent: true,
    visibility: (props) => !props.disabled,
  },
};

export function createCheckboxInputConfig(
  Component: ComponentType<CheckboxInputProps>,
  icon: IconType
): ComponentConfig<CheckboxInputProps> {
  return {
    id: "checkboxInput",
    icon,
    name: "Checkbox Input",
    Component,
    controls,
  };
}
