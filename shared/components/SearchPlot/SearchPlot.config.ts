/* istanbul ignore file */
import type {
  ComponentConfig,
  IconType,
} from "@shared/types/dls.types";
import type { SearchPlotProps } from "./SearchPlot";
import type { ComponentType } from "react";

const controls: ComponentConfig<SearchPlotProps>["controls"] = {
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
  showTabs: {
    type: ["boolean", "code"],
    label: "Show Tabs",
    hasArabic: false,
    defaultValue: true,
    defaultCode: "return true",
  },
  ownerTypeOptions: {
    type: ["code"],
    label: "Owner Type Labels",
    defaultValue: {
      plot: "By Plot",
      plot_ar: "حسب قطعة الأرض",
      company: "By Company Owner",
      company_ar: "حسب مالك الشركة",
      owner: "By Owner",
      owner_ar: "حسب المالك",
      randomAllocation: "Random Allocation",
      randomAllocation_ar: "التخصيص العشوائي",
    },
    defaultCode: `return {
  plot: "By Plot",
  plot_ar: "حسب قطعة الأرض",
  company: "By Company Owner",
  company_ar: "حسب مالك الشركة",
  owner: "By Owner",
  owner_ar: "حسب المالك",
  randomAllocation: "Random Allocation",
  randomAllocation_ar: "التخصيص العشوائي",
}`,
  },
  initialOwnerType: {
    type: ["code"],
    label: "Initial Owner Type",
    options: ["plot", "company", "owner", "randomAllocation"],
    defaultValue: "plot",
    defaultCode: 'return "plot"',
  },
  enabledTabs: {
    type: ["code"],
    label: "Enabled Tabs",
    defaultValue: {
      plot: true,
      company: true,
      owner: true,
      randomAllocation: true,
    },
    defaultCode: `return {
  plot: true,
  company: true,
  owner: true,
  randomAllocation: true,
}`,
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

export function createSearchPlotConfig(
  Component: ComponentType<SearchPlotProps>,
  icon: IconType
): ComponentConfig<SearchPlotProps> {
  return {
    id: "searchPlot",
    icon,
    name: "Search Plot",
    Component,
    controls,
  };
}
