import type { ComponentConfig, ControlDefinition, IconType } from "@shared/types/dls.types";
import type { TextInputProps } from "@shared/types";
import type { ComponentType } from "react";

const controls: {
  [K in keyof Omit<
    TextInputProps,
    "language"
  >]?: ControlDefinition<TextInputProps>;
} & {
  propsOverride?: ControlDefinition<TextInputProps>;
  fieldKey?: ControlDefinition<TextInputProps>;
} = {
  fieldKey: {
    type: ["text"],
    label: "Field Key",
    hasArabic: false,
    //  isRequred and unique are gonna use only for form components to track input values
    isRequired: true,
    unique: true,
    defaultValue: "",
  },
  label: {
    type: ["text", "code"],
    label: "Label",
    hasArabic: true,
    defaultValue: "input label",
    defaultValueAr: "input label",
    defaultCode: "return 'input label'",
    defaultCodeAr: "return 'input label'",
  },
  placeholder: {
    type: ["text", "code"],
    label: "Placeholder",
    hasArabic: true,
    defaultValue: "placeholder",
    defaultValueAr: "placeholder",
    defaultCode: "return 'placeholder'",
    defaultCodeAr: "return 'placeholder'",
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
  onChange: {
    type: ["code"],
    label: "onChange",
    defaultCode: 'console.log("input value changed", eventData)',
    isEvent: true,
    visibility: (props) => !props.disabled,
  },
};

export function createTextInputConfig(
  Component: ComponentType<TextInputProps>,
  icon: IconType
): ComponentConfig<TextInputProps> {
  return {
    id: "input",
    icon,
    name: "Input",
    Component,
    controls,
  };
}
