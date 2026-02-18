import type {
  ComponentConfig,
  ControlDefinition,
  IconType,
} from "@shared/types/dls.types";
import type { ComponentType } from "react";
import type { DummyComponentProps } from "./DummyComponent";

const controls: {
  [K in keyof DummyComponentProps]?: ControlDefinition<DummyComponentProps>;
} & {
  propsOverride?: ControlDefinition<DummyComponentProps>;
} = {
  title: {
    type: ["text", "code"],
    label: "Title",
    hasArabic: true,
    defaultValue: "Dummy Component",
    defaultValueAr: "Dummy Component",
    defaultCode: "return 'Dummy Component'",
    defaultCodeAr: "return 'Dummy Component'",
  },
  propsOverride: {
    type: ["propsOverride"],
    label: "Props Override",
    defaultCode: "return {}",
  },
};

export function createDummyConfig(
  Component: ComponentType<DummyComponentProps>,
  icon: IconType
): ComponentConfig<DummyComponentProps> {
  return {
    id: "dummy",
    icon,
    name: "Dummy Component",
    Component,
    controls,
  };
}
