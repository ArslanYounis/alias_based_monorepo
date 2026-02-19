import type {
  ComponentConfig,
  ControlsConfig,
  IconType,
} from "@shared/types/dls.types";
import type { ComponentType } from "react";

export interface ApplicationDetailProps {
  title?: string;
  title_ar?: string;
  applicationNumber?: string;
  applicationNumber_ar?: string;
  applicationDate?: string;
  applicationDate_ar?: string;
  referenceNumber?: string;
  referenceNumber_ar?: string;
  buttonTitle?: string;
  buttonTitle_ar?: string;
  showButton?: boolean;
  onButtonClick?: () => void;
}

const controls: ControlsConfig<ApplicationDetailProps> = {
  title: {
    type: ["text", "code"],
    label: "Title",
    hasArabic: true,
    defaultValue: "Application Details",
    defaultValueAr: "Application Details",
    defaultCode: 'return "Application Details"',
    defaultCodeAr: 'return "Application Details"',
  },
  applicationNumber: {
    type: ["text", "code"],
    label: "Application Number",
    hasArabic: true,
    defaultValue: "100101225",
    defaultValueAr: "100101225",
    defaultCode: 'return "100101225"',
    defaultCodeAr: 'return "100101225"',
  },
  applicationDate: {
    type: ["text", "code"],
    label: "Application Date",
    hasArabic: true,
    defaultValue: "13:00 - 28/03/2025",
    defaultValueAr: "13:00 - 28/03/2025",
    defaultCode: 'return "13:00 - 28/03/2025"',
    defaultCodeAr: 'return "13:00 - 28/03/2025"',
  },
  referenceNumber: {
    type: ["text", "code"],
    label: "Reference Number",
    hasArabic: true,
    defaultValue: "",
    defaultValueAr: "",
    defaultCode: 'return ""',
    defaultCodeAr: 'return ""',
  },
  buttonTitle: {
    type: ["text", "code"],
    label: "Button Title",
    hasArabic: true,
    defaultValue: "Add Agent",
    defaultValueAr: "Add Agent",
    defaultCode: 'return "Add Agent"',
    defaultCodeAr: 'return "Add Agent"',
  },
  showButton: {
    type: ["boolean", "code"],
    label: "Show/Hide Button",
    defaultValue: true,
    defaultCode: "return true",
  },
  onButtonClick: {
    type: ["code"],
    label: "On Button Click",
    defaultCode: "console.log('button clicked')",
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
    id: "applicationDetail",
    icon,
    name: "Application Detail",
    Component,
    controls,
  };
}
