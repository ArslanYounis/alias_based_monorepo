import type { ComponentConfig, IconType } from "@shared/types/dls.types";
import type { FilterBarProps } from "@shared/types";
import type { ComponentType } from "react";

export function createFilterBarConfig(
  Component: ComponentType<FilterBarProps>,
  icon: IconType,
): ComponentConfig<FilterBarProps> {
  return {
    id: "filterBar",
    icon,
    name: "Filter Bar",
    Component,
    controls: {
      sortOptions: {
        type: ["code"],
        label: "Sort Options",
        defaultValue: ["Newest First", "Oldest First"],
        defaultCode: 'return ["Newest First", "Oldest First"]',
      },
      applicationOptions: {
        type: ["code"],
        label: "Application Options",
        defaultValue: ["My Applications", "All Applications"],
        defaultCode: 'return ["My Applications", "All Applications"]',
      },
      searchValue: {
        type: ["code"],
        label: "Search Value",
        defaultValue: "",
        defaultCode: "return ''",
      },
      onSearchChange: {
        type: ["code"],
        label: "On Search",
        defaultCode: "console.log('search value', eventData.target.value)",
        isEvent: true,
      },
      onReset: {
        type: ["code"],
        label: "On Reset",
        defaultCode: "console.log('reset')",
        isEvent: true,
      },
      propsOverride: {
        type: ["propsOverride"],
        label: "Props Override",
        defaultCode: "return {}",
      },
    },
  };
}
