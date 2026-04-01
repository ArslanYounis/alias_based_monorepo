import type {
  ComponentConfig,
  IconType,
} from "@shared/types/dls.types";
import type { ModalStepsProps } from "./ModalSteps";
import type { ComponentType } from "react";

const controls: ComponentConfig<ModalStepsProps>["controls"] = {
  title: {
    type: ["text", "code"],
    label: "Title",
    hasArabic: true,
    defaultValue: "Confirm and create",
    defaultValueAr: "Confirm and create",
    defaultCode: 'return "Confirm and create"',
    defaultCodeAr: 'return "Confirm and create"',
  },
  subText: {
    type: ["text", "code"],
    label: "Sub Text",
    hasArabic: true,
    defaultValue: "Step 3 of 3",
    defaultValueAr: "Step 3 of 3",
    defaultCode: 'return "Step 3 of 3"',
    defaultCodeAr: 'return "Step 3 of 3"',
  },
  propsOverride: {
    type: ["propsOverride"],
    label: "Props Override",
    defaultCode: "return {}",
  },
};

export function createModalStepsConfig(
  Component: ComponentType<ModalStepsProps>,
  icon: IconType
): ComponentConfig<ModalStepsProps> {
  return {
    id: "modalSteps",
    icon,
    name: "Modal Steps",
    Component,
    controls,
  };
}
