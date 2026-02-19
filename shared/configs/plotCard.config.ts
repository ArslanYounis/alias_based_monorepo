import type {
  ComponentConfig,
  ControlsConfig,
  IconType,
} from "@shared/types/dls.types";
import type { ComponentType } from "react";

export interface PlotCardProps {
  title?: string;
  title_ar?: string;
  showViewButton?: boolean;
  showOwnersButton?: boolean;
  showChangePlotButton?: boolean;
  plots?: unknown[];
  defaultShowMore?: boolean;
  onPressView?: (eventData: unknown) => void;
  onPressPlotChange?: (eventData: unknown) => void;
  onPressOwners?: (eventData: unknown) => void;
}

const controls: ControlsConfig<PlotCardProps> = {
  title: {
    type: ["text", "code"],
    label: "Title",
    hasArabic: true,
    defaultValue: "Plot",
    defaultValueAr: "Plot",
    defaultCode: 'return "Plot"',
    defaultCodeAr: 'return "Plot"',
  },
  showViewButton: {
    type: ["boolean", "code"],
    label: "Show View Button",
    defaultValue: false,
    defaultCode: "return false",
  },
  showOwnersButton: {
    type: ["boolean", "code"],
    label: "Show Owners Button",
    defaultValue: false,
    defaultCode: "return false",
  },
  showChangePlotButton: {
    type: ["boolean", "code"],
    label: "Show Change Plot Button",
    defaultValue: false,
    defaultCode: "return false",
  },
  plots: {
    type: ["code"],
    label: "Plots",
    defaultValue: [],
    defaultCode: "return []",
  },
  defaultShowMore: {
    type: ["boolean", "code"],
    label: "Default Show More?",
    defaultValue: false,
    defaultCode: "return false",
  },
  onPressView: {
    type: ["code"],
    label: "On Press View Button",
    defaultCode: "console.log('view plot', eventData)",
    isEvent: true,
  },
  onPressPlotChange: {
    type: ["code"],
    label: "On Press Change Plot Button",
    defaultCode: "console.log('change plot', eventData)",
    isEvent: true,
  },
  onPressOwners: {
    type: ["code"],
    label: "On Press Owners Button",
    defaultCode: "console.log('owners plot', eventData)",
    isEvent: true,
  },
  propsOverride: {
    type: ["propsOverride"],
    label: "Props Override",
    defaultCode: "return {}",
  },
};

export function createPlotCardConfig(
  Component: ComponentType<PlotCardProps>,
  icon: IconType
): ComponentConfig<PlotCardProps> {
  return {
    id: "plotDetail",
    icon,
    name: "Plot Cards",
    Component,
    controls,
  };
}
