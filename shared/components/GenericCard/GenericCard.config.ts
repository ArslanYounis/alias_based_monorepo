/* istanbul ignore file */
import type {
  ComponentConfig,
  IconType,
} from "@shared/types/dls.types";
import type { IGenericCardProps } from "./GenericCard";
import type { ComponentType } from "react";

const controls: ComponentConfig<IGenericCardProps>["controls"] = {
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
    hasArabic: true,
    defaultValue: "Card Title",
    defaultCode: "return 'Card Title'",
  },
  cardTitleLabel: {
    type: ["text", "code"],
    label: "Collapsed Label (EN)",
    hasArabic: true,
    defaultValue: "Reference",
    defaultCode: "return 'Reference'",
  },
  cardTitleValue: {
    type: ["text", "code"],
    label: "Collapsed Value (EN)",
    hasArabic: true,
    defaultValue: "REF-001",
    defaultCode: "return 'REF-001'",
  },
  subText: {
    type: ["text", "code"],
    label: "Sub Text (EN)",
    hasArabic: true,
    defaultValue: "",
    defaultCode: "return ''",
  },
  status: {
    type: ["text", "code"],
    label: "Status (EN)",
    hasArabic: true,
    defaultValue: "",
    defaultCode: "return ''",
  },
  statusType: {
    type: ["select", "code"],
    label: "Status Type",
    hasArabic: false,
    options: ["success", "pending", "failed", "info"],
    defaultValue: "pending",
    defaultCode: 'return "pending"',
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
    hasArabic: true,
    defaultValue: "Documents",
    defaultCode: "return 'Documents'",
  },
  documentDescription: {
    type: ["text", "code"],
    label: "Document Description Title (EN)",
    hasArabic: true,
    defaultValue: "Document Description",
    defaultCode: "return 'Document Description'",
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
    defaultValue: [
      {
        title: "Edit",
        title_ar: "تعديل",
        type: "secondary",
        onClick: () => console.log("Edit clicked"),
      },
    ],
    defaultCode: `
return [
  {
    title: "Edit",
    title_ar: "تعديل",
    type: "secondary",
    onClick: () => console.log("Edit clicked")
  }
];
      `,
  },
  titleButtons: {
    type: ["code"],
    label: "Title Buttons",
    defaultValue: [
      {
        title: "Edit",
        title_ar: "تعديل",
        type: "secondary",
        onClick: () => console.log("Edit clicked"),
      },
    ],
    defaultCode: `
return [
  {
    title: "Edit",
    title_ar: "تعديل",
    type: "secondary",
    onClick: () => console.log("Edit clicked")
  }
];
      `,
  },
  rowsData: {
    type: ["code"],
    label: "Rows Data",
    defaultValue: [
      {
        label: "Owner Name",
        label_ar: "اسم المالك",
        value: "John Doe",
        value_ar: "جون دو",
      },
      {
        label: "MOI Unified Number",
        label_ar: "رقم وزارة الداخلية الموحد",
        value: "330928",
        value_ar: "330928",
        fieldType: "text",
        rowVariant: "field",
        defaultValue: "330928",
        inputProps: {
          placeholder: "Enter MOI Number",
          placeholder_ar: "أدخل رقم وزارة الداخلية",
        },
      },
      {
        label: "Nationality",
        label_ar: "الجنسية",
        value: "UAE",
        value_ar: "الإمارات العربية المتحدة",
        fieldType: "select",
        rowVariant: "field",
        defaultValue: "UAE",
        inputProps: {
          options: [
            {
              label: "United Arab Emirates",
              value: "UAE",
              label_ar: "الإمارات العربية المتحدة",
            },
            {
              label: "Saudi Arabia",
              value: "SA",
              label_ar: "المملكة العربية السعودية",
            },
          ],
        },
      },
      {
        label: "Created Date",
        label_ar: "تاريخ الإنشاء",
        value: "01 Jan 2024",
        value_ar: "01 يناير 2024",
      },
    ],
    defaultCode: `return [
  {
    label: "Owner Name",
    label_ar: "اسم المالك",
    value: "John Doe",
    value_ar: "جون دو"
    // First row: default display (uses card-level rowVariant/fieldType if provided)
  },
  {
    label: "MOI Unified Number",
    label_ar: "رقم وزارة الداخلية الموحد",
    value: "330928",
    value_ar: "330928",
    // Second row: text field - each row can have its own fieldType and rowVariant
    fieldType: "text",
    rowVariant: "field",
    inputProps: {
      onChange: (v) => console.log("MOI Number changed:", v),
      placeholder: "Enter MOI Number",
      placeholder_ar: "أدخل رقم وزارة الداخلية"
    }
  },
  {
    label: "Nationality",
    label_ar: "الجنسية",
    value: "United Arab Emirates",
    value_ar: "الإمارات العربية المتحدة",
    // Third row: select dropdown
    fieldType: "select",
    rowVariant: "field",
    inputProps: {
      onChange: (v) => console.log("Nationality changed:", v),
      options: [
        { label: "United Arab Emirates", value: "UAE", label_ar: "الإمارات العربية المتحدة" },
        { label: "Saudi Arabia", value: "SA", label_ar: "المملكة العربية السعودية" }
      ]
    }
  },
  {
    label: "Created Date",
    label_ar: "تاريخ الإنشاء",
    value: "01 Jan 2024",
    value_ar: "01 يناير 2024"
    // Fourth row: default display
  }
];`,
  },
  documentButtons: {
    type: ["code"],
    label: "Documents Buttons",
    defaultValue: [
      {
        title: "View All",
        title_ar: "عرض الكل",
        type: "secondary",
        onClick: () => console.log("View All clicked"),
      },
    ],
    defaultCode: `
return [
  {
    title: "View All",
    title_ar: "عرض الكل",
    type: "secondary",
    onClick: () => console.log("View All clicked")
  }
];`,
  },
  documents: {
    type: ["code"],
    label: "Documents Data",
    defaultValue: [
      {
        id: "1",
        documentName: "Document 1",
        documentName_ar: "المستند ١",
        fileType: "PDF",
        size: "2.5 MB",
        isUploaded: true,
        onDownloadClick: () => console.log("Download Document 1"),
      },
      {
        id: "2",
        documentName: "Document 2",
        documentName_ar: "المستند ٢",
        fileType: "JPG",
        size: "1.2 MB",
        isUploaded: true,
        onDownloadClick: () => console.log("Download Document 2"),
      },
    ],
    defaultCode: `
return [
  {
    id: "1",
    documentName: "Document 1",
    documentName_ar: "المستند ١",
    fileType: "PDF",
    size: "2.5 MB",
    isUploaded: true,
    onDownloadClick: () => console.log("Download Document 1")
  },
  {
    id: "2",
    documentName: "Document 2",
    documentName_ar: "المستند ٢",
    fileType: "JPG",
    size: "1.2 MB",
    isUploaded: true,
    onDownloadClick: () => console.log("Download Document 2")
    }];
      `,
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
    defaultValue: [
      {
        title: "View All",
        title_ar: "عرض الكل",
        type: "secondary",
        onClick: () => console.log("View All clicked"),
      },
    ],
    defaultCode: `
return [
  {
    title: "View All",
    title_ar: "عرض الكل",
    type: "secondary",
    onClick: () => console.log("View All clicked")
  }
];`,
  },
  propsOverride: {
    type: ["propsOverride"],
    label: "Props Override",
    defaultCode: "return {}",
  },
};

export function createGenericCardConfig(
  Component: ComponentType<IGenericCardProps>,
  icon: IconType
): ComponentConfig<IGenericCardProps> {
  return {
    id: "genericCard",
    icon,
    name: "Generic Card",
    Component,
    controls,
  };
}
