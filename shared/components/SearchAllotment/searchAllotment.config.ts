import type {
    ComponentConfig,
    IconType,
} from "@shared/types/dls.types";
import type { ComponentType } from "react";
import type { SearchAllotmentResultProps } from "./searchAllotment";

const controls: ComponentConfig<SearchAllotmentResultProps>["controls"] = {
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
        type: ["boolean"], // keep consistent with earlier configs
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

export function createSearchAllotmentConfig(
    Component: ComponentType<SearchAllotmentResultProps>,
    icon: IconType
): ComponentConfig<SearchAllotmentResultProps> {
    return {
        id: "searchAllotment",
        icon,
        name: "Search Allotment",
        Component,
        controls,
    };
}