import type {
  ComponentConfig,
  ControlDefinition,
  IconType,
} from "@shared/types/dls.types";
import type { ApplicationSummaryProps } from "@shared/types";
import type { ComponentType } from "react";

const controls: {
  [K in keyof Omit<ApplicationSummaryProps, "language">]?: ControlDefinition<ApplicationSummaryProps>;
} & {
  propsOverride?: ControlDefinition<ApplicationSummaryProps>;
} = {
  title: {
    type: ["text", "code"],
    label: "Title",
    hasArabic: true,
    defaultValue: "Application Summary",
    defaultValueAr: "ملخص الطلب",
    defaultCode: 'return "Application Summary"',
    defaultCodeAr: 'return "ملخص الطلب"',
  },
  data: {
    type: ["code"],
    label: "Data",
    defaultCode: "return []",
  },
  propsOverride: {
    type: ["propsOverride"],
    label: "Props Override",
    defaultCode: "return {}",
  },
};

export function createApplicationSummaryConfig(
  Component: ComponentType<ApplicationSummaryProps>,
  icon: IconType
): ComponentConfig<ApplicationSummaryProps> {
  return {
    id: "applicationSummary",
    icon,
    name: "Application Summary",
    Component,
    controls,
  };
}
