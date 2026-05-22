/* istanbul ignore file */
import type {
  ComponentConfig,
  IconType,
} from "@shared/types/dls.types";
import type { IOwnerCardProps } from "./OwnerCard";
import type { ComponentType } from "react";

const controls: ComponentConfig<IOwnerCardProps>["controls"] = {
  title: {
    type: ["text", "code"],
    label: "Title",
    hasArabic: true,
    defaultValue: "Owner",
    defaultValueAr: "Owner",
    defaultCode: 'return "Owner"',
    defaultCodeAr: 'return "Owner"',
  },
  isExpandable: {
    type: ["boolean", "code"],
    label: "Is Expandable?",
    defaultValue: true,
    defaultCode: "return true",
  },
  showViewButton: {
    type: ["boolean", "code"],
    label: "Show View Button",
    defaultValue: false,
    defaultCode: "return false",
  },
  showPlotsButton: {
    type: ["boolean", "code"],
    label: "Show Plots Button",
    defaultValue: false,
    defaultCode: "return false",
  },
  showEditButton: {
    type: ["boolean", "code"],
    label: "Show Edit Button",
    defaultValue: false,
    defaultCode: "return false",
  },
  showDeleteButton: {
    type: ["boolean", "code"],
    label: "Show Delete Button",
    defaultValue: false,
    defaultCode: "return false",
  },
  showChangeOwnerButton: {
    type: ["boolean", "code"],
    label: "Show Change Owner Button",
    defaultValue: false,
    defaultCode: "return false",
  },
  itemsPerRow: {
    type: ["select"],
    label: "Items Per Row",
    options: ["1", "2"],
    defaultValue: "1",
  },
  owners: {
    type: ["code"],
    label: "Owners",
    defaultValue: [
      {
        ownerId: "1",
        ownerArgs: "123",
        name: "John Doe",
        name_ar: "جون دو",
        fields: [
          {
            label: "UAE National ID",
            value: "N/A",
            label_ar: "رقم الهوية الإماراتية",
            value_ar: "N/A",
          },
          {
            label: "MOI Unified Number",
            value: "N/A",
            label_ar: "رقم الموحد (وزارة الداخلية)",
            value_ar: "N/A",
          },
          {
            label: "Archive Number",
            value: "",
            label_ar: "رقم الأرشيف",
            value_ar: "",
          },
          {
            label: "Nationality",
            value: "Unknown",
            label_ar: "الجنسية",
            value_ar: "Unknown",
          },
          {
            label: "Special Nationality",
            value: "No",
            label_ar: "جنسية خاصة",
            value_ar: "No",
          },
          {
            label: "Share",
            value: "100% Allotment 50% Share",
            label_ar: "الحصة",
            value_ar: "100% Allotment 50% Share",
          },
          {
            label: "Right Hold Type",
            value: "Ownership Musataha",
            label_ar: "أنواع أصحاب الحقوق",
            value_ar: "Ownership Musataha",
          },
        ],
      },
    ],
    defaultCode: `return [{
  fields: [
    { label: "UAE National ID", value: "N/A", label_ar: "رقم الهوية الإماراتية", value_ar: "N/A" },
    { label: "MOI Unified Number", value: "N/A", label_ar: "رقم الموحد (وزارة الداخلية)", value_ar: "N/A" },
    { label: "Archive Number", value: "", label_ar: "رقم الأرشيف", value_ar: "" },
    { label: "Archive Number", value: "" },
    { label: "Nationality", value: "Unknown", label_ar: "الجنسية", value_ar: "Unknown" },
    { label: "Special Nationality", value: "No", label_ar: "جنسية خاصة", value_ar: "No" },
    { label: "Special Nationality", value: "No" },
    { label: "Share", value: "100% Allotment 50% Share", label_ar: "الحصة", value_ar: "100% Allotment 50% Share" },
    { label: "Right Hold Type", value: "Ownership Musataha", label_ar: "أنواع أصحاب الحقوق", value_ar: "Ownership Musataha" },
  ],
}]`,
  },
  defaultShowMore: {
    type: ["boolean", "code"],
    label: "Default Show More?",
    defaultValue: false,
    defaultCode: "return false",
  },
  onPressAction: {
    type: ["code"],
    label: "On Press any action",
    defaultCode: "console.log('action pressed', eventData)",
    isEvent: true,
  },
  propsOverride: {
    type: ["propsOverride"],
    label: "Props Override",
    defaultCode: "return {}",
  },
};

export function createOwnerCardConfig(
  Component: ComponentType<IOwnerCardProps>,
  icon: IconType
): ComponentConfig<IOwnerCardProps> {
  return {
    id: "ownerDetail",
    icon,
    name: "Owner Cards",
    Component,
    controls,
  };
}
