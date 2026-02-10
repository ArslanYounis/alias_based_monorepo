import type { ComponentConfig, ControlDefinition, IconType } from "@shared/types/dls.types";
import type { ButtonsProps } from "@shared/types";
import type { ComponentType } from "react";

const controls: {
  [K in keyof Omit<ButtonsProps, "language">]?: ControlDefinition<ButtonsProps>;
} & {
  propsOverride?: ControlDefinition<ButtonsProps>;
} = {
  title: {
    type: ["text", "code"],
    label: "Title",
    hasArabic: true,
    defaultValue: "DLS Button",
    defaultValueAr: "DLS Button",
    defaultCode: "return 'Code Button Title'",
    defaultCodeAr: "return 'Code Button Title'",
  },
  fullWidth: {
    type: ["boolean", "code"],
    label: "Full Width?",
    defaultValue: false,
    defaultCode: "return false",
  },
  type: {
    type: ["select", "code"],
    label: "Type",
    options: ["primary", "secondary", "tertiary", "text-link", "delete"],
    defaultValue: "primary",
    defaultCode: "return 'primary'",
  },
  size: {
    type: ["select"],
    label: "Size",
    options: ["s", "m", "l"],
    defaultValue: "m",
  },
  disabled: {
    type: ["boolean", "code"],
    label: "Disabled",
    defaultValue: false,
    defaultCode: "return false",
  },
  onClick: {
    type: ["code"],
    label: "onClick",
    defaultCode: 'console.log("button click",props.label)',
    isEvent: true,
  },
  propsOverride: {
    type: ["propsOverride"],
    label: "Props Override",
    defaultCode: "return {}",
  },
};

export function createButtonConfig(
  Component: ComponentType<ButtonsProps>,
  icon: IconType
): ComponentConfig<ButtonsProps> {
  return {
    id: "button",
    icon,
    name: "Button",
    Component,
    controls,
  };
}
