import type {
  ComponentConfig,
  IconType,
} from "@shared/types/dls.types";
import type { ComponentType } from "react";
import type { DariPlotSearchProps } from "./dariPlotSearch";

const controls: ComponentConfig<DariPlotSearchProps>["controls"] = {
  title: {
    type: ["text", "code"],
    label: "Title",
    hasArabic: true,
    defaultValue: "Search Plot",
    defaultValueAr: "العثور على قطعة أرض",
    defaultCode: 'return "Search Plot"',
    defaultCodeAr: 'return "العثور على قطعة أرض"',
  },
  subtitle: {
    type: ["text", "code"],
    label: "Subtitle",
    hasArabic: true,
    defaultValue: "Choose a plot by type",
    defaultValueAr: "اختر قطعة أرض حسب النوع",
    defaultCode: 'return "Choose a plot by type"',
    defaultCodeAr: 'return "اختر قطعة أرض حسب النوع"',
  },
  selected: {
    type: ["code"],
    label: "Pre-selected Search Results",
    defaultValue: null,
    defaultCode: "return null",
  },
  onSubmit: {
    type: ["code"],
    label: "On Submit",
    defaultCode: "console.log('plot search submit', eventData)",
    isEvent: true,
  },
  propsOverride: {
    type: ["propsOverride"],
    label: "Props Override",
    defaultCode: "return {}",
  },
};

export function createDariPlotSearchConfig(
  Component: ComponentType<DariPlotSearchProps>,
  icon: IconType
): ComponentConfig<DariPlotSearchProps> {
  return {
    id: "dariPlotSearch",
    icon,
    name: "Dari Plot Search",
    Component,
    controls,
  };
}