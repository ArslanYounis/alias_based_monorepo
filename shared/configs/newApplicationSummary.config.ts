import type {
  ComponentConfig,
  ControlDefinition,
  IconType,
} from "@shared/types/dls.types";
import type { NewApplicationSummaryProps } from "@shared/types";
import type { ComponentType } from "react";

const controls: {
  [K in keyof Omit<NewApplicationSummaryProps, "language">]?: ControlDefinition<NewApplicationSummaryProps>;
} & {
  propsOverride?: ControlDefinition<NewApplicationSummaryProps>;
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
  applicationId: {
    type: ["text", "code"],
    label: "Application ID",
    hasArabic: false,
    defaultValue: "",
    defaultCode: 'return ""',
  },
  onPressPlotView: {
    type: ["code"],
    label: "On Press Plot View",
    defaultCode: "console.log('plot view pressed')",
    isEvent: true,
  },
  onPressOwnerAction: {
    type: ["code"],
    label: "On Press Owner Action",
    defaultCode: "console.log('owner action pressed', action, owner)",
    isEvent: true,
  },
  propsOverride: {
    type: ["propsOverride"],
    label: "Props Override",
    defaultCode: "return {}",
  },
};

export function createNewApplicationSummaryConfig(
  Component: ComponentType<NewApplicationSummaryProps>,
  icon: IconType
): ComponentConfig<NewApplicationSummaryProps> {
  return {
    id: "newApplicationSummary",
    icon,
    name: "New Application Summary",
    Component,
    controls,
  };
}
