import { FilterIcon } from "lucide-react";
import type { ComponentConfig } from "@shared/types/dls.types";
import PlotCard, { type IPlotCardProps } from "./PlotCard";

const PlotCardConfigs: ComponentConfig<IPlotCardProps> = {
  id: "plotDetail",
  icon: FilterIcon,
  name: "Plot Cards",
  Component: PlotCard,
  controls: {
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
      defaultCode: `return [{
  fields: [
    { label: "Municipality", value: "N/A" },
    { label: "Zone/District", value: "N/A" },
    { label: "Sector", value: "" },
    { label: "Plot Address", value: "" },
  ],
  plotNumber: "RCH9999",
}]`,
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
  },
};

export default PlotCardConfigs;
