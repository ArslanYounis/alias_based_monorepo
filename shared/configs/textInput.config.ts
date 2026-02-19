import type { ComponentConfig, ControlDefinition, IconType } from "@shared/types/dls.types";
import type { TextInputProps } from "@shared/types";
import type { ComponentType } from "react";

const controls: {
  [K in keyof Omit<TextInputProps, "language">]?: ControlDefinition<TextInputProps>;
} & {
  propsOverride?: ControlDefinition<TextInputProps>;
  fieldKey?: ControlDefinition<TextInputProps>;
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
    visibility: (props: TextInputProps) => !props.disabled,
  },
  propsOverride: {
    type: ["propsOverride"],
    label: "Props Override",
    defaultCode: "return {}",
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
