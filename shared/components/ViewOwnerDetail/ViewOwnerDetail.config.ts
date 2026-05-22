/* istanbul ignore file */
import type {
  ComponentConfig,
  IconType,
} from "@shared/types/dls.types";
import type { ViewOwnerDetailProps } from "./ViewOwnerDetail";
import type { ComponentType } from "react";

const controls: ComponentConfig<ViewOwnerDetailProps>["controls"] = {
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
  owner: {
    type: ["code"],
    label: "Owner Detail",
    defaultValue: {
      details: [
        {
          label: "UAE National ID",
          value: "N/A",
        },
        {
          label: "MOI Unified Number",
          value: "N/A",
        },
        {
          label: "Archive Number",
          value: "",
        },
        {
          label: "Nationality",
          value: "Unknown",
        },
        {
          label: "Special Nationality",
          value: "No",
        },
        {
          label: "Share",
          value: "100% Allotment 50% Share",
        },
        {
          label: "Right Hold Type",
          value: "Ownership Musataha",
        },
      ],
      name: "",
    },
    defaultCode: `return {
  details: [
    { label: "UAE National ID", value: "N/A" },
    { label: "MOI Unified Number", value: "N/A" },
    { label: "Archive Number", value: "" },
    { label: "Nationality", value: "Unknown" },
    { label: "Special Nationality", value: "No" },
    { label: "Share", value: "100% Allotment 50% Share" },
    { label: "Right Hold Type", value: "Ownership Musataha" },
  ],
  name: ""
}`,
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
