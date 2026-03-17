import { Filter } from "lucide-react-native";
import type { ComponentConfig } from "@shared/types/dls.types";
import { FilterBar } from "./FilterBar";
import type { FilterBarProps } from "./FilterBar";

const FilterBarConfig: ComponentConfig<FilterBarProps> = {
  id: "filterBar",
  icon: Filter,
  name: "Filter Bar",
  Component: FilterBar,
  controls: {
    theme: {
      type: ["select"],
      label: "Theme",
      options: ["light", "dark"],
      defaultValue: "dark",
    },
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

export default FilterBarConfig;
