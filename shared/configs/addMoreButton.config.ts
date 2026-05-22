import type {
  ComponentConfig,
  ControlDefinition,
  IconType,
} from "@shared/types/dls.types";
import type { AddMoreButtonProps } from "@shared/types";
import type { ComponentType } from "react";

const controls: {
  [K in keyof Omit<
    AddMoreButtonProps,
    "language"
  >]?: ControlDefinition<AddMoreButtonProps>;
} & {
  propsOverride?: ControlDefinition<AddMoreButtonProps>;
} = {
  title: {
    type: ["text", "code"],
    label: "Title",
    hasArabic: true,
    defaultValue: "Add More Owner",
    defaultValueAr: "Add More Owner",
    defaultCode: 'return "Add More Owner"',
    defaultCodeAr: 'return "Add More Owner"',
  },
  onClick: {
    type: ["code"],
    label: "onClick",
    defaultCode: "console.log('add more button clicked')",
    isEvent: true,
  },
  propsOverride: {
    type: ["propsOverride"],
    label: "Props Override",
    defaultCode: "return {}",
  },
};

export function createAddMoreButtonConfig(
  Component: ComponentType<AddMoreButtonProps>,
  icon: IconType
): ComponentConfig<AddMoreButtonProps> {
  return {
    id: "addMoreButton",
    icon,
    name: "Add More Button",
    Component,
    controls,
  };
}
