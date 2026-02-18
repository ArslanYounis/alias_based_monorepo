import type {
  ComponentConfig,
  ControlDefinition,
  IconType,
} from "@shared/types/dls.types";
import type { BreadcrumbProps } from "@shared/types";
import type { ComponentType } from "react";

const controls: {
  [K in keyof Omit<BreadcrumbProps, "language">]?: ControlDefinition<BreadcrumbProps>;
} & {
  propsOverride?: ControlDefinition<BreadcrumbProps>;
} = {
  items: {
    type: ["code"],
    label: "Properties",
    defaultCode:
      "return [{ label: 'Home', onClick: () => null }, { label: 'Level 1 Page Title', onClick: () => null }]",
  },
  selectedItemIndex: {
    type: ["number", "code"],
    label: "Selected Item Index",
    defaultValue: 1,
    defaultCode: "return 1",
  },
  isSelectedHover: {
    type: ["boolean", "code"],
    label: "Is Selected Hover",
    defaultValue: true,
    defaultCode: "return true",
  },
  propsOverride: {
    type: ["propsOverride"],
    label: "Props Override",
    defaultCode: "return {}",
  },
};

export function createBreadcrumbConfig(
  Component: ComponentType<BreadcrumbProps>,
  icon: IconType
): ComponentConfig<BreadcrumbProps> {
  return {
    id: "breadcrumb",
    icon,
    name: "Breadcrumb",
    Component,
    controls,
  };
}
