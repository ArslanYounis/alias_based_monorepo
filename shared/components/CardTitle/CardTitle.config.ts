/* istanbul ignore file */
import type {
  ComponentConfig,
  IconType,
} from "@shared/types/dls.types";
import type { ICardTitleProps } from "./CardTitle";
import type { ComponentType } from "react";

const controls: ComponentConfig<ICardTitleProps>["controls"] = {
  title: {
    type: ["text", "code"],
    label: "Title (EN)",
    hasArabic: true,
    defaultValue: "Card Title",
    defaultValueAr: "عنوان البطاقة",
    defaultCode: 'return "Card Title"',
    defaultCodeAr: 'return "عنوان البطاقة"',
  },
  description: {
    type: ["text", "code"],
    label: "Description",
    hasArabic: true,
    defaultValue: "Card Description",
    defaultValueAr: "وصف البطاقة",
    defaultCode: 'return "Card Description"',
    defaultCodeAr: 'return "وصف البطاقة"',
  },
  variant: {
    type: ["select"],
    label: "Variant",
    options: ["large", "medium", "small"],
    defaultValue: "medium",
  },
  isExpandable: {
    type: ["boolean", "code"],
    label: "Is Expandable",
    defaultValue: false,
    defaultCode: "return false",
  },
  isExpanded: {
    type: ["boolean", "code"],
    label: "Is Expanded",
    defaultValue: false,
    defaultCode: "return false",
  },
  onToggleExpand: {
    type: ["code"],
    label: "On Toggle Expand",
    defaultCode: "console.log('toggle expand')",
    isEvent: true,
  },
  subText: {
    type: ["text", "code"],
    label: "Sub Text",
    hasArabic: true,
    defaultValue: "",
    defaultValueAr: "",
    defaultCode: 'return ""',
    defaultCodeAr: 'return ""',
  },
  status: {
    type: ["text", "code"],
    label: "Status",
    hasArabic: true,
    defaultValue: "",
    defaultValueAr: "",
    defaultCode: 'return ""',
    defaultCodeAr: 'return ""',
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
    defaultCode: "return []",
  },
  showTitleButtons: {
    type: ["boolean", "code"],
    label: "Show Title Buttons",
    defaultValue: false,
    defaultCode: "return false",
  },
  titleButtons: {
    type: ["code"],
    label: "Title Buttons",
    defaultCode: "return []",
  },
  showBorder: {
    type: ["boolean", "code"],
    label: "Show Border",
    defaultValue: true,
    defaultCode: "return true",
  },
  propsOverride: {
    type: ["propsOverride"],
    label: "Props Override",
    defaultCode: "return {}",
  },
};

export function createCardTitleConfig(
  Component: ComponentType<ICardTitleProps>,
  icon: IconType
): ComponentConfig<ICardTitleProps> {
  return {
    id: "cardTitle",
    icon,
    name: "Card Title",
    Component,
    controls,
  };
}
