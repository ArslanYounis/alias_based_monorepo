/* istanbul ignore file */
import type {
  ComponentConfig,
  IconType,
} from "@shared/types/dls.types";
import type { IGenericTableCardProps } from "./GenericTableCard";
import type { ComponentType } from "react";

const controls: ComponentConfig<IGenericTableCardProps>["controls"] = {
  showTitleSection: {
    type: ["boolean", "code"],
    label: "Show Title Section",
    defaultValue: true,
    defaultCode: "return true",
  },
  isExpandable: {
    type: ["boolean", "code"],
    label: "Expandable",
    defaultValue: true,
    defaultCode: "return true",
  },
  isExpanded: {
    type: ["boolean", "code"],
    label: "Expanded",
    defaultValue: true,
    defaultCode: "return true",
  },
  showButtons: {
    type: ["boolean", "code"],
    label: "Show Header Buttons",
    defaultValue: false,
    defaultCode: "return false",
  },
  defaultShowMore: {
    type: ["boolean", "code"],
    label: "Default Show More",
    defaultValue: false,
    defaultCode: "return false",
  },
  variant: {
    type: ["select", "code"],
    label: "Title Variant",
    options: ["large", "medium", "small"],
    defaultValue: "large",
    defaultCode: "return 'large'",
  },
  showRowButtons: {
    type: ["boolean", "code"],
    label: "Show Row Buttons",
    defaultValue: true,
    defaultCode: "return true",
  },
  rowVariant: {
    type: ["select", "code"],
    label: "Row Variant",
    options: ["3colButton", "4colButton", "5colButton", "6colButton"],
    defaultValue: "6colButton",
    defaultCode: "return '6colButton'",
  },
  title: {
    type: ["text", "code"],
    label: "Title (Expanded - EN)",
    defaultValue: "Owner Information",
    defaultCode: "return 'Owner Information'",
  },
  title_ar: {
    type: ["text", "code"],
    label: "Title (Expanded - AR)",
    defaultValue: "معلومات المالك",
    defaultCode: "return 'معلومات المالك'",
  },
  description: {
    type: ["text", "code"],
    label: "Description (Expanded - EN)",
    defaultValue: "Owner Information",
    defaultCode: "return 'Owner Information'",
  },
  description_ar: {
    type: ["text", "code"],
    label: "Description (Expanded - AR)",
    defaultValue: "معلومات المالك",
    defaultCode: "return 'معلومات المالك'",
  },
  cardTitleLabel: {
    type: ["text", "code"],
    label: "Collapsed Label (EN)",
    defaultValue: "Name",
    defaultCode: "return 'Name'",
  },
  cardTitleLabel_ar: {
    type: ["text", "code"],
    label: "Collapsed Label (AR)",
    defaultValue: "الاسم",
    defaultCode: "return 'الاسم'",
  },
  cardTitleValue: {
    type: ["text", "code"],
    label: "Collapsed Value (EN)",
    defaultValue: "Talal Ahmed Salem",
    defaultCode: "return 'Talal Ahmed Salem'",
  },
  cardTitleValue_ar: {
    type: ["text", "code"],
    label: "Collapsed Value (AR)",
    defaultValue: "طلال أحمد سالم",
    defaultCode: "return 'طلال أحمد سالم'",
  },
  buttons: {
    type: ["code"],
    label: "Header Buttons",
    defaultCode: "return []",
  },
  titleButtons: {
    type: ["code"],
    label: "Title Buttons",
    defaultCode: "return []",
  },
  columnsData: {
    type: ["code"],
    label: "Columns Definition",
    defaultCode: `return [
  { key: "field", label: "Field", label_ar: "الحقل" },
  { key: "col1", label: "Value 1", label_ar: "القيمة 1" },
  { key: "col2", label: "Value 2", label_ar: "القيمة 2" },
  { key: "col3", label: "Value 3", label_ar: "القيمة 3" },
]`,
  },
  rowsData: {
    type: ["code"],
    label: "Rows Data",
    defaultCode: "return []",
  },
  showFooterButtons: {
    type: ["boolean", "code"],
    label: "Show Footer Buttons",
    defaultValue: false,
    defaultCode: "return false",
  },
  footerButton: {
    type: ["code"],
    label: "Footer Buttons",
    defaultCode: "return []",
  },
  showPagination: {
    type: ["boolean", "code"],
    label: "Show Pagination",
    defaultValue: true,
    defaultCode: "return true",
  },
  handlePaginationInternally: {
    type: ["boolean", "code"],
    label: "Handle Pagination Internally",
    defaultValue: true,
    defaultCode: "return true",
  },
  currentPage: {
    type: ["number", "code"],
    label: "Current Page",
    defaultValue: 1,
    defaultCode: "return 1",
  },
  totalPages: {
    type: ["number", "code"],
    label: "Total Pages",
    defaultValue: 5,
    defaultCode: "return 5",
  },
  pageSize: {
    type: ["number", "code"],
    label: "Page Size",
    defaultValue: 5,
    defaultCode: "return 5",
  },
  onToggleExpand: {
    type: ["code"],
    label: "Toggle Expand Handler",
    defaultCode: "return () => console.log('Toggle expand')",
  },
  onPageChange: {
    type: ["code"],
    label: "Page Change Handler",
    defaultCode: "return (page) => console.log('Page changed', page)",
  },
  propsOverride: {
    type: ["propsOverride"],
    label: "Props Override",
    defaultCode: "return {}",
  },
};

export function createGenericTableCardConfig(
  Component: ComponentType<IGenericTableCardProps>,
  icon: IconType
): ComponentConfig<IGenericTableCardProps> {
  return {
    id: "genericTableCard",
    icon,
    name: "Generic Table Card",
    Component,
    controls,
  };
}
