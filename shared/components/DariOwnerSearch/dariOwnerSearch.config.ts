import type {
    ComponentConfig,
    IconType,
} from "@shared/types/dls.types";
import type { DariOwnerSearchProps } from "./dariOwnerSearch";
import type { ComponentType } from "react";

const controls: ComponentConfig<DariOwnerSearchProps>["controls"] = {
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
    type: ["boolean"],
    label: "Show Tabs",
    defaultValue: true,
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

export function createDariOwnerSearchConfig(
    Component: ComponentType<DariOwnerSearchProps>,
    icon: IconType
): ComponentConfig<DariOwnerSearchProps> {
    return {
        id: "dariOwnerSeach",
        icon,
        name: "Dari Owner Search",
        Component,
        controls,
    };
}