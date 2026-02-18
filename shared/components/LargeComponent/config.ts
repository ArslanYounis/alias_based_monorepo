import type {
  ComponentConfig,
  ControlDefinition,
  IconType,
} from "@shared/types/dls.types";
import type { ComponentType } from "react";

const controls: {
  propsOverride?: ControlDefinition<Record<string, unknown>>;
} = {
  propsOverride: {
    type: ["propsOverride"],
    label: "Props Override",
    defaultCode: "return {}",
  },
};

export function createLargeComponentConfig(
  Component: ComponentType<Record<string, unknown>>,
  icon: IconType
): ComponentConfig<Record<string, unknown>> {
  return {
    id: "largeComponent",
    icon,
    name: "Large Component",
    Component,
    controls,
  };
}
