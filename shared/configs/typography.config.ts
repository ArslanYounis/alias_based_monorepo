import type {
  ComponentConfig,
  ControlDefinition,
  IconType,
} from "@shared/types/dls.types";
import type { TypographyProps } from "@shared/types";
import type { ComponentType } from "react";

const controls: {
  [K in keyof Omit<
    TypographyProps,
    "language"
  >]?: ControlDefinition<TypographyProps>;
} & {
  propsOverride?: ControlDefinition<TypographyProps>;
} = {
  variant: {
    type: ["select"],
    label: "Variant",
    options: [
      "h1",
      "h1-hero",
      "h1-shouting",
      "h2",
      "h3",
      "h4",
      "text-xs",
      "text-sm",
      "text-md",
      "text-lg",
      "text-bold-xxs",
      "text-bold-xs",
      "text-bold-sm",
      "text-bold-md",
      "text-bold-lg",
    ],
    defaultValue: "h1",
  },
  color: {
    type: ["select"],
    label: "Color",
    options: ["default", "dimmed", "primary", "link", "link-hover"],
    defaultValue: "default",
  },
  text: {
    type: ["text", "code"],
    label: "Text",
    hasArabic: true,
    defaultValue: "Sample",
    defaultValueAr: "Sample",
    defaultCode: 'return "Sample"',
    defaultCodeAr: 'return "Sample"',
  },
  propsOverride: {
    type: ["propsOverride"],
    label: "Props Override",
    defaultCode: "return {}",
  },
};

export function createTypographyConfig(
  Component: ComponentType<TypographyProps>,
  icon: IconType
): ComponentConfig<TypographyProps> {
  return {
    id: "typography",
    icon,
    name: "Typography",
    Component,
    controls,
  };
}
