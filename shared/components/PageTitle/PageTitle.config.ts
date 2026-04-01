import type {
  ComponentConfig,
  IconType,
} from "@shared/types/dls.types";
import type { PageTitleProps } from "./PageTitle";
import type { ComponentType } from "react";

const controls: ComponentConfig<PageTitleProps>["controls"] = {
  label: {
    type: ["text", "code"],
    label: "Title (Expanded - EN)",
    defaultValue: "Page Title",
    defaultCode: "return 'Page Title'",
  },
  label_ar: {
    type: ["text", "code"],
    label: "Title (Expanded - AR)",
    defaultValue: "عنوان الصفحة",
    defaultCode: "return 'عنوان الصفحة'",
  },
  showButtons: {
    type: ["boolean", "code"],
    label: "Show Buttons",
    defaultValue: false,
    defaultCode: "return false",
  },
  buttons: {
    type: ["code"],
    label: "Buttons",
    defaultCode: `
return [
  {
    title: "Add Agent",
    title_ar: "إضافة وكيل",
    type: "secondary",
    onClick: () => console.log("Add Agent clicked"),
  },
];
      `,
  },
  propsOverride: {
    type: ["propsOverride"],
    label: "Props Override",
    defaultCode: "return {}",
  },
};

export function createPageTitleConfig(
  Component: ComponentType<PageTitleProps>,
  icon: IconType
): ComponentConfig<PageTitleProps> {
  return {
    id: "pageTitle",
    icon,
    name: "Page Title",
    Component,
    controls,
  };
}
