import type {
  ComponentConfig,
  ControlsConfig,
  IconType,
} from "@shared/types/dls.types";
import type { ComponentType } from "react";

export interface ViewOwnerDetailProps {
  mainTitle?: string;
  mainTitle_ar?: string;
  plotCode?: string;
  plotCode_ar?: string;
  ownerText?: string;
  ownerText_ar?: string;
  theme?: "light" | "dark";
  owner?: { details: { label: string; value: string }[]; name: string };
}

const controls: ControlsConfig<ViewOwnerDetailProps> = {
  mainTitle: {
    type: ["text", "code"],
    label: "Main Title",
    hasArabic: true,
    defaultValue: "Owner Detail",
    defaultValueAr: "تفاصيل المالك",
    defaultCode: 'return "Owner Detail"',
    defaultCodeAr: 'return "تفاصيل المالك"',
  },
  plotCode: {
    type: ["text", "code"],
    label: "Plot Code",
    hasArabic: true,
    defaultValue: "0-222-000-RCH9999",
    defaultValueAr: "0-222-000-RCH9999",
    defaultCode: 'return "0-222-000-RCH9999"',
    defaultCodeAr: 'return "0-222-000-RCH9999"',
  },
  ownerText: {
    type: ["text", "code"],
    label: "Owner Text",
    hasArabic: true,
    defaultValue: "Owner",
    defaultValueAr: "المالك",
    defaultCode: 'return "Owner"',
    defaultCodeAr: 'return "المالك"',
  },
  theme: {
    type: ["select"],
    label: "Theme",
    options: ["light", "dark"],
    defaultValue: "dark",
  },
  owner: {
    type: ["code"],
    label: "Owner Detail",
    defaultValue: { details: [], name: "" },
    defaultCode: "return { details: [], name: '' }",
  },
  propsOverride: {
    type: ["propsOverride"],
    label: "Props Override",
    defaultCode: "return {}",
  },
};

export function createViewOwnerDetailConfig(
  Component: ComponentType<ViewOwnerDetailProps>,
  icon: IconType
): ComponentConfig<ViewOwnerDetailProps> {
  return {
    id: "viewOwnerDetail",
    icon,
    name: "Owner Detail",
    Component,
    controls,
  };
}
