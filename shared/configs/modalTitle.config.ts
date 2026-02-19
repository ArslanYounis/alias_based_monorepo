import type {
  ComponentConfig,
  ControlsConfig,
  IconType,
} from "@shared/types/dls.types";
import type { ComponentType } from "react";

export interface ModalTitleProps {
  label?: string;
  label_ar?: string;
  language?: "en" | "ar";
}

const controls: ControlsConfig<ModalTitleProps> = {
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
