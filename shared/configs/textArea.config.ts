import type { ComponentConfig, ControlDefinition, IconType } from "@shared/types/dls.types";
import type { TextAreaProps } from "@shared/types";
import type { ComponentType } from "react";

const controls: {
  [K in keyof Omit<
    TextAreaProps,
    "language"
  >]?: ControlDefinition<TextAreaProps>;
} & {
  fieldKey?: ControlDefinition<TextAreaProps>;
  propsOverride?: ControlDefinition<TextAreaProps>;
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
    defaultValue: "TextArea",
    defaultValueAr: "TextArea",
    defaultCode: "return 'TextArea'",
    defaultCodeAr: "return 'TextArea'",
  },
  placeholder: {
    type: ["text", "code"],
    label: "Placeholder",
    hasArabic: true,
    defaultValue: "Enter...",
    defaultValueAr: "Enter...",
    defaultCode: "return 'Enter...'",
    defaultCodeAr: "return 'Enter...'",
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
    defaultCode: 'console.log("input changes", eventData)',
    isEvent: true,
    visibility: (props) => !props.disabled,
  },
};

export function createTextAreaConfig(
  Component: ComponentType<TextAreaProps>,
  icon: IconType
): ComponentConfig<TextAreaProps> {
  return { id: "textarea", icon, name: "Textarea", Component, controls };
}
