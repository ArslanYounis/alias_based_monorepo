import type {
  ComponentConfig,
  ControlDefinition,
  IconType,
} from "@shared/types/dls.types";
import type { ComponentType } from "react";
import type { PlotSearchProps } from "./PlotSearch";

const controls: {
  [K in keyof PlotSearchProps]?: ControlDefinition<PlotSearchProps>;
} & {
  propsOverride?: ControlDefinition<PlotSearchProps>;
} = {
  defaultPageSize: {
    type: ["number", "code"],
    label: "Default Page Size",
    defaultValue: 10,
    defaultCode: "return 10",
  },
  propsOverride: {
    type: ["propsOverride"],
    label: "Props Override",
    defaultCode: "return {}",
  },
};

export function createPlotSearchConfig(
  Component: ComponentType<PlotSearchProps>,
  icon: IconType
): ComponentConfig<PlotSearchProps> {
  return {
    id: "plot-search",
    icon,
    name: "Plot Search",
    Component,
    controls,
  };
}
