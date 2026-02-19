import type {
  ComponentConfig,
  ControlDefinition,
  IconType,
} from "@shared/types/dls.types";
import type { TitleBarProps } from "@shared/types";
import type { ComponentType } from "react";

const controls: {
  [K in keyof Omit<TitleBarProps, "language">]?: ControlDefinition<TitleBarProps>;
} & {
  propsOverride?: ControlDefinition<TitleBarProps>;
} = {
  showTitle: {
    type: ["boolean", "code"],
    label: "Show Title",
    defaultValue: true,
    defaultCode: "return true",
  },
  title: {
    type: ["text", "code"],
    label: "Title",
    hasArabic: true,
    defaultValue: "Land Allocation",
    defaultValueAr: "Land Allocation",
    defaultCode: 'return "Land Allocation"',
    defaultCodeAr: 'return "Land Allocation"',
    visibility: (props) => !!props.showTitle,
  },
  showAcronym: {
    type: ["boolean", "code"],
    label: "Show Acronym",
    defaultValue: true,
    defaultCode: "return true",
  },
  acronym: {
    type: ["text", "code"],
    label: "Acronym",
    hasArabic: true,
    defaultValue: "LA",
    defaultValueAr: "LA",
    defaultCode: "return 'LA'",
    defaultCodeAr: "return 'LA'",
    visibility: (props) => !!props.showAcronym,
  },
  showButton: {
    type: ["boolean", "code"],
    label: "Show Button",
    defaultValue: true,
    defaultCode: "return true",
  },
  buttonLabel: {
    type: ["text", "code"],
    label: "Button Label",
    hasArabic: true,
    defaultValue: "New Application",
    defaultValueAr: "New Application",
    defaultCode: 'return "New Application"',
    defaultCodeAr: 'return "New Application"',
    visibility: (props) => !!props.showButton,
  },
  buttonType: {
    type: ["select"],
    label: "Button Type",
    options: ["primary", "secondary", "tertiary"],
    defaultValue: "primary",
    visibility: (props) => !!props.showButton,
  },
  theme: {
    type: ["select"],
    label: "Theme",
    options: ["light", "dark"],
    defaultValue: "light",
  },
  onClick: {
    type: ["code"],
    label: "onClick",
    defaultCode: "console.log('title click')",
    isEvent: true,
  },
  propsOverride: {
    type: ["propsOverride"],
    label: "Props Override",
    defaultCode: "return {}",
  },
};

export function createTitleBarConfig(
  Component: ComponentType<TitleBarProps>,
  icon: IconType
): ComponentConfig<TitleBarProps> {
  return {
    id: "titles",
    icon,
    name: "Titles",
    Component,
    controls,
  };
}
