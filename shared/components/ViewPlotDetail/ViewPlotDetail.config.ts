/* istanbul ignore file */
import type {
  ComponentConfig,
  IconType,
} from "@shared/types/dls.types";
import type { ViewPlotDetailProps } from "./ViewPlotDetail";
import type { ComponentType } from "react";

const controls: ComponentConfig<ViewPlotDetailProps>["controls"] = {
  plotTitle: {
    type: ["text", "code"],
    label: "Plot Title",
    hasArabic: true,
    defaultValue: "Plot Title",
    defaultValueAr: "عنوان الأرض",
    defaultCode: 'return "Plot Title"',
    defaultCodeAr: 'return "عنوان الأرض"',
  },
  plotIds: {
    type: ["code"],
    label: "Plot IDs",
    hasArabic: false,
    defaultValue: [],
    defaultCode: "return []",
  },
  ownerText: {
    type: ["text", "code"],
    label: "Owner Text",
    hasArabic: true,
    defaultValue: "Owner",
    defaultValueAr: "المالك",
    defaultCode: 'return "Owner"',
    defaultCodeAr: 'return "المالك"',
  },
  showOwnerDetails: {
    type: ["boolean", "code"],
    label: "Show Owner Details",
    defaultValue: true,
    defaultCode: "return true",
  },
  propsOverride: {
    type: ["propsOverride"],
    label: "Props Override",
    defaultCode: "return {}",
  },
};

export function createViewPlotDetailConfig(
  Component: ComponentType<ViewPlotDetailProps>,
  icon: IconType
): ComponentConfig<ViewPlotDetailProps> {
  return {
    id: "viewPlotDetail",
    icon,
    name: "Plot Detail",
    Component,
    controls,
  };
}
