import type {
  ComponentConfig,
  ControlDefinition,
  IconType,
} from "@shared/types/dls.types";
import type { ScreenLoaderProps } from "@shared/types";
import type { ComponentType } from "react";

const controls: {
  [K in keyof ScreenLoaderProps]?: ControlDefinition<ScreenLoaderProps>;
} & {
  propsOverride?: ControlDefinition<ScreenLoaderProps>;
} = {
  isLoading: {
    type: ["code"],
    label: "Is Loading?",
    defaultCode: "return false",
  },
  propsOverride: {
    type: ["propsOverride"],
    label: "Props Override",
    defaultCode: "return {}",
  },
};

export function createScreenLoaderConfig(
  Component: ComponentType<ScreenLoaderProps>,
  icon: IconType
): ComponentConfig<ScreenLoaderProps> {
  return {
    id: "screenLoader",
    icon,
    name: "Screen Loader",
    Component,
    controls,
  };
}
