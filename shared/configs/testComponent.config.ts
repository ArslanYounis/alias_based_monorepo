import type {
  ComponentConfig,
  ControlsConfig,
  IconType,
} from "@shared/types/dls.types";
import type { ComponentType } from "react";

export interface TestComponentProps {
  buttonLabel?: string;
  onSubmit?: (data: { firstName: string; lastName: string }) => void;
}

const controls: ControlsConfig<TestComponentProps> = {
  buttonLabel: {
    type: ["text", "code"],
    label: "Title",
    hasArabic: true,
    defaultValue: "Submit",
    defaultValueAr: "Submit",
    defaultCode: 'return "Submit"',
    defaultCodeAr: 'return "Submit"',
  },
  onSubmit: {
    type: ["code"],
    label: "On Press View Button",
    defaultCode: "console.log('submitted Data', eventData)",
    isEvent: true,
  },
  propsOverride: {
    type: ["propsOverride"],
    label: "Props Override",
    defaultCode: "return {}",
  },
};

export function createTestComponentConfig(
  Component: ComponentType<TestComponentProps>,
  icon: IconType
): ComponentConfig<TestComponentProps> {
  return {
    id: "testComponent",
    icon,
    name: "Test Component",
    Component,
    controls,
  };
}
