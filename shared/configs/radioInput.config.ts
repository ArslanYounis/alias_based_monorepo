import type { ComponentConfig, ControlDefinition, IconType } from "@shared/types/dls.types";
import type { RadioInputProps } from "@shared/types";
import type { ComponentType } from "react";

const controls: {
  [K in keyof Omit<
    RadioInputProps,
    "language"
  >]?: ControlDefinition<RadioInputProps>;
} & {
  fieldKey?: ControlDefinition<RadioInputProps>;
  bindingData?: ControlDefinition<RadioInputProps>;
  propsOverride?: ControlDefinition<RadioInputProps>;
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
    defaultValue: "Radio Input",
    defaultValueAr: "Radio Input",
    defaultCode: "return 'Radio Input'",
    defaultCodeAr: "return 'Radio Input'",
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

export function createRadioInputConfig(
  Component: ComponentType<RadioInputProps>,
  icon: IconType
): ComponentConfig<RadioInputProps> {
  return { id: "radioInput", icon, name: "Radio Input", Component, controls };
}
