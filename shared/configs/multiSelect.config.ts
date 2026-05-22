import type { ComponentConfig, ControlDefinition, IconType } from "@shared/types/dls.types";
import type { MultiSelectProps } from "@shared/types";
import type { ComponentType } from "react";

const controls: {
  [K in keyof Omit<
    MultiSelectProps,
    "language"
  >]?: ControlDefinition<MultiSelectProps>;
} & {
  fieldKey?: ControlDefinition<MultiSelectProps>;
  bindingData?: ControlDefinition<MultiSelectProps>;
  propsOverride?: ControlDefinition<MultiSelectProps>;
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
    defaultValue: "Multi Select",
    defaultValueAr: "Multi Select",
    defaultCode: "return 'Multi Select'",
    defaultCodeAr: "return 'Multi Select'",
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
  bindingData: {
    type: ["bindingData"],
    label: "Binding Data",
    isRequired: true,
  },
  maxSelection: {
    type: ["number", "code"],
    label: "Max Selection",
    defaultValue: undefined,
    defaultCode: "return undefined",
  },
  onChange: {
    type: ["code"],
    label: "onChange",
    defaultCode: 'console.log("input changes", eventData)',
    isEvent: true,
    visibility: (props) => !props.disabled,
  },
  showAddButton: {
    type: ["boolean", "code"],
    label: "Show Add Button?",
    defaultValue: false,
    defaultCode: "return false",
  },
};

export function createMultiSelectConfig(
  Component: ComponentType<MultiSelectProps>,
  icon: IconType
): ComponentConfig<MultiSelectProps> {
  return { id: "multiselect", icon, name: "MultiSelect Input", Component, controls };
}
