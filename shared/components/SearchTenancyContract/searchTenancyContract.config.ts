import type {
    ComponentConfig,
    IconType,
} from "@shared/types/dls.types";
import type { ComponentType } from "react";
import type { SearchTenancyContractProps } from "./searchTenancyContract";

const controls: ComponentConfig<SearchTenancyContractProps>["controls"] = {
    selected: {
        type: ["code"],
        label: "Pre-selected Search Results",
        defaultValue: [],
        defaultCode: "return []",
    },
    onSubmit: {
        type: ["code"],
        label: "On Submit",
        defaultCode: "console.log('select tenancy contract submit', eventData)",
        isEvent: true,
    },
    propsOverride: {
        type: ["propsOverride"],
        label: "Props Override",
        defaultCode: "return {}",
    },
};

export function createSearchTenancyContractConfig(
    Component: ComponentType<SearchTenancyContractProps>,
    icon: IconType
): ComponentConfig<SearchTenancyContractProps> {
    return {
        id: "searchTenancyContract",
        icon,
        name: "Search Tenancy Contract",
        Component,
        controls,
    };
}