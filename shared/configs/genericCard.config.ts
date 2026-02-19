import type {
  ComponentConfig,
  ControlsConfig,
  IconType,
} from "@shared/types/dls.types";
import type { ComponentType } from "react";

export interface GenericCardProps {
  showTitleSection?: boolean;
  showBorder?: boolean;
  showTitleButtons?: boolean;
  isExpanded?: boolean;
  isExpandable?: boolean;
  handleToggleInternally?: boolean;
  onToggleExpand?: () => void;
  showButtons?: boolean;
  showMoreButton?: boolean;
  defaultShowMore?: boolean;
  variant?: string;
  title?: string;
  title_ar?: string;
  cardTitleLabel?: string;
  cardTitleLabel_ar?: string;
  cardTitleValue?: string;
  cardTitleValue_ar?: string;
  subText?: string;
  subText_ar?: string;
  status?: string;
  status_ar?: string;
  hasDocuments?: boolean;
  documentTitle?: string;
  documentTitle_ar?: string;
  documentDescription?: string;
  documentDescription_ar?: string;
  document_type?: string;
  isUploaded?: boolean;
  buttons?: unknown[];
  titleButtons?: unknown[];
  rowsData?: unknown[];
  documentButtons?: unknown[];
  documents?: unknown[];
  showFooterButtons?: boolean;
  footerButton?: unknown[];
}

const controls: ControlsConfig<GenericCardProps> = {
  showTitleSection: {
    type: ["boolean", "code"],
    label: "Show Title Section",
    defaultValue: true,
    defaultCode: "return true",
  },
  showBorder: {
    type: ["boolean", "code"],
    label: "Show Border",
    defaultValue: false,
    defaultCode: "return false",
  },
  showTitleButtons: {
    type: ["boolean", "code"],
    label: "Show Title Buttons",
    defaultValue: false,
    defaultCode: "return false",
  },
  isExpanded: {
    type: ["boolean", "code"],
    label: "Default Expanded",
    defaultValue: true,
    defaultCode: "return true",
  },
  isExpandable: {
    type: ["boolean", "code"],
    label: "Expandable",
    defaultValue: true,
    defaultCode: "return true",
  },
  handleToggleInternally: {
    type: ["boolean", "code"],
    label: "Handle Toggle Internally",
    defaultValue: true,
    defaultCode: "return true",
  },
  onToggleExpand: {
    type: ["code"],
    label: "On Toggle Expand",
    defaultCode: "console.log('toggle expand')",
    isEvent: true,
  },
  showButtons: {
    type: ["boolean", "code"],
    label: "Show Buttons",
    defaultValue: false,
    defaultCode: "return false",
  },
  showMoreButton: {
    type: ["boolean", "code"],
    label: "Show More Button",
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
  title: {
    type: ["text", "code"],
    label: "Title (Expanded - EN)",
    defaultValue: "Card Title",
    defaultCode: "return 'Card Title'",
  },
  title_ar: {
    type: ["text", "code"],
    label: "Title (Expanded - AR)",
    defaultValue: "عنوان البطاقة",
    defaultCode: "return 'عنوان البطاقة'",
  },
  cardTitleLabel: {
    type: ["text", "code"],
    label: "Collapsed Label (EN)",
    defaultValue: "Reference",
    defaultCode: "return 'Reference'",
  },
  cardTitleLabel_ar: {
    type: ["text", "code"],
    label: "Collapsed Label (AR)",
    defaultValue: "المرجع",
    defaultCode: "return 'المرجع'",
  },
  cardTitleValue: {
    type: ["text", "code"],
    label: "Collapsed Value (EN)",
    defaultValue: "REF-001",
    defaultCode: "return 'REF-001'",
  },
  cardTitleValue_ar: {
    type: ["text", "code"],
    label: "Collapsed Value (AR)",
    defaultValue: "REF-001",
    defaultCode: "return 'REF-001'",
  },
  subText: {
    type: ["text", "code"],
    label: "Sub Text (EN)",
    defaultValue: "",
    defaultCode: "return ''",
  },
  subText_ar: {
    type: ["text", "code"],
    label: "Sub Text (AR)",
    defaultValue: "",
    defaultCode: "return ''",
  },
  status: {
    type: ["text", "code"],
    label: "Status (EN)",
    defaultValue: "",
    defaultCode: "return ''",
  },
  status_ar: {
    type: ["text", "code"],
    label: "Status (AR)",
    defaultValue: "",
    defaultCode: "return ''",
  },
  hasDocuments: {
    type: ["boolean", "code"],
    label: "Show Documents",
    defaultValue: false,
    defaultCode: "return false",
  },
  documentTitle: {
    type: ["text", "code"],
    label: "Document Section Title (EN)",
    defaultValue: "Documents",
    defaultCode: "return 'Documents'",
  },
  documentTitle_ar: {
    type: ["text", "code"],
    label: "Document Section Title (AR)",
    defaultValue: "المستندات",
    defaultCode: "return 'المستندات'",
  },
  documentDescription: {
    type: ["text", "code"],
    label: "Document Description Title (EN)",
    defaultValue: "Document Description",
    defaultCode: "return 'Document Description'",
  },
  documentDescription_ar: {
    type: ["text", "code"],
    label: "Document Description Title (AR)",
    defaultValue: "وصف الوثيقة",
    defaultCode: "return 'وصف الوثيقة'",
  },
  document_type: {
    type: ["select", "code"],
    label: "Document Type",
    options: ["default", "base"],
    defaultValue: "default",
    defaultCode: "return 'default'",
  },
  isUploaded: {
    type: ["boolean", "code"],
    label: "Documents Uploaded",
    defaultValue: true,
    defaultCode: "return true",
  },
  buttons: {
    type: ["code"],
    label: "Buttons",
    defaultCode: "return []",
  },
  titleButtons: {
    type: ["code"],
    label: "Title Buttons",
    defaultCode: "return []",
  },
  rowsData: {
    type: ["code"],
    label: "Rows Data",
    defaultCode: "return []",
  },
  documentButtons: {
    type: ["code"],
    label: "Documents Buttons",
    defaultCode: "return []",
  },
  documents: {
    type: ["code"],
    label: "Documents Data",
    defaultCode: "return []",
  },
  showFooterButtons: {
    type: ["boolean", "code"],
    label: "Show Footer Documents",
    defaultValue: false,
    defaultCode: "return false",
  },
  footerButton: {
    type: ["code"],
    label: "Footer Buttons",
    defaultCode: "return []",
  },
  propsOverride: {
    type: ["propsOverride"],
    label: "Props Override",
    defaultCode: "return {}",
  },
};

export function createGenericCardConfig(
  Component: ComponentType<GenericCardProps>,
  icon: IconType
): ComponentConfig<GenericCardProps> {
  return {
    id: "genericCard",
    icon,
    name: "Generic Card",
    Component,
    controls,
  };
}
