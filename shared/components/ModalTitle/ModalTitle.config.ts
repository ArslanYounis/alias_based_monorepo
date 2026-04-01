import type {
  ComponentConfig,
  IconType,
} from "@shared/types/dls.types";
import type { ModalTitleProps } from "./ModalTitle";
import type { ComponentType } from "react";

const controls: ComponentConfig<ModalTitleProps>["controls"] = {
  label: {
    type: ["text", "code"],
    label: "Label",
    hasArabic: true,
    defaultValue: "New Application",
    defaultValueAr: "New Application",
    defaultCode: 'return "New Application"',
    defaultCodeAr: 'return "New Application"',
  },
  propsOverride: {
    type: ["propsOverride"],
    label: "Props Override",
    defaultCode: "return {}",
  },
};

export function createModalTitleConfig(
  Component: ComponentType<ModalTitleProps>,
  icon: IconType
): ComponentConfig<ModalTitleProps> {
  return {
    id: "modalTitle",
    icon,
    name: "Modal Title",
    Component,
    controls,
  };
}
