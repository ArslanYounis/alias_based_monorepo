import type {
  ComponentConfig,
  IconType,
} from "@shared/types/dls.types";
import type { ApplicationDetailProps } from "../../types";
import type { ComponentType } from "react";

const controls: ComponentConfig<ApplicationDetailProps>["controls"] = {
  applicationTitle: {
    type: ["text", "code"],
    label: "Application Title",
    hasArabic: true,
    defaultValue: "Application Title",
    defaultValueAr: "عنوان الطلب",
    defaultCode: 'return "Application Title"',
    defaultCodeAr: 'return "عنوان الطلب"',
  },
  applicationId: {
    type: ["text", "code"],
    label: "Application ID",
    hasArabic: false,
    defaultValue: "",
    defaultCode: 'return ""',
  },
  theme: {
    type: ["select"],
    label: "Theme",
    options: ["light", "dark"],
    defaultValue: "dark",
  },
  onOwnerClick: {
    type: ["code"],
    label: "On Owner Action Click",
    defaultCode: "console.log('owner action clicked', eventData)",
    isEvent: true,
  },
  onPlotClick: {
    type: ["code"],
    label: "On Plot Action Click",
    defaultCode: "console.log('plot action clicked', eventData)",
    isEvent: true,
  },
  onDocumentOpen: {
    type: ["code"],
    label: "On Document Open (URL)",
    defaultCode: "window.open(eventData, '_blank')",
    isEvent: true,
  },
  propsOverride: {
    type: ["propsOverride"],
    label: "Props Override",
    defaultCode: "return {}",
  },
};

export function createApplicationDetailConfig(
  Component: ComponentType<ApplicationDetailProps>,
  icon: IconType
): ComponentConfig<ApplicationDetailProps> {
  return {
    id: "applicationDetailCard",
    icon,
    name: "Application Detail Card",
    Component,
    controls,
  };
}
