/* istanbul ignore file */
import type {
  ComponentConfig,
  IconType,
} from "@shared/types/dls.types";
import type { OwnerSearchProps } from "./OwnerSearch";
import type { ComponentType } from "react";

const controls: ComponentConfig<OwnerSearchProps>["controls"] = {
  title: {
    type: ["text", "code"],
    label: "Title",
    hasArabic: true,
    defaultValue: "",
    defaultValueAr: "",
    defaultCode: 'return ""',
    defaultCodeAr: 'return ""',
  },
  showTabs: {
    type: ["boolean", "code"],
    label: "Show Tabs",
    hasArabic: false,
    defaultValue: true,
    defaultCode: "return true",
  },
  initialOwnerType: {
    type: ["select", "code"],
    label: "Initial Owner Type",
    options: ["company", "owner"],
    defaultValue: "company",
    defaultCode: 'return "company"',
  },
  ownerTypeOptions: {
    type: ["code"],
    label: "Owner Type Options",
    defaultValue: {
      company: "By Company Owner",
      company_ar: "بواسطة مالك الشركة",
      owner: "By Owner",
      owner_ar: "بواسطة المالك",
    },
    defaultCode: `return {
  company: 'By Company Owner',
  company_ar: 'بواسطة مالك الشركة',
  owner: 'By Owner',
  owner_ar: 'بواسطة المالك',
}`,
  },
  selected: {
    type: ["code"],
    label: "Selected Owners",
    defaultValue: [],
    defaultCode: "return []",
  },
  onSubmit: {
    type: ["code"],
    label: "On Submit",
    defaultCode: "console.log('owner search submit', eventData)",
    isEvent: true,
  },
  propsOverride: {
    type: ["propsOverride"],
    label: "Props Override",
    defaultCode: "return {}",
  },
};

export function createOwnerSearchConfig(
  Component: ComponentType<OwnerSearchProps>,
  icon: IconType
): ComponentConfig<OwnerSearchProps> {
  return {
    id: "ownerSearch",
    icon,
    name: "Owner Search",
    Component,
    controls,
  };
}
