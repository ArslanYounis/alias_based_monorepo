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
  lastColItem: {
    type: ["select", "code"],
    label: "Last Column Item",
    options: [
      "button",
      "radio",
      "checkbox",
      "selectSingle",
      "selectMulti",
      "input",
      "date",
    ],
    defaultValue: "button",
    defaultCode: "return 'button'",
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
    hasArabic: true,
    defaultValue: "Owner Information",
    defaultCode: "return 'Owner Information'",
  },
  description: {
    type: ["text", "code"],
    label: "Description (Expanded - EN)",
    hasArabic: true,
    defaultValue: "Owner Information",
    defaultCode: "return 'Owner Information'",
  },
  cardTitleLabel: {
    type: ["text", "code"],
    label: "Collapsed Label (EN)",
    hasArabic: true,
    defaultValue: "Name",
    defaultCode: "return 'Name'",
  },
  cardTitleValue: {
    type: ["text", "code"],
    label: "Collapsed Value (EN)",
    hasArabic: true,
    defaultValue: "Talal Ahmed Salem",
    defaultCode: "return 'Talal Ahmed Salem'",
  },
  buttons: {
    type: ["code"],
    label: "Header Buttons",
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
];`,
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
];`,
  },
  columnsData: {
    type: ["code"],
    label: "Columns Definition",
    defaultValue: [
      { key: "field", label: "Field", label_ar: "الحقل" },
      { key: "col1", label: "Value 1", label_ar: "القيمة 1" },
      { key: "col2", label: "Value 2", label_ar: "القيمة 2" },
      { key: "col3", label: "Value 3", label_ar: "القيمة 3" },
    ],
    defaultCode: `return [
  { key: "field", label: "Field", label_ar: "الحقل" },
  { key: "col1", label: "Value 1", label_ar: "القيمة 1" },
  { key: "col2", label: "Value 2", label_ar: "القيمة 2" },
  { key: "col3", label: "Value 3", label_ar: "القيمة 3" },
];`,
  },
  rowsData: {
    type: ["code"],
    label: "Rows Data",
    defaultValue: [
      {
        label: "Identity Details",
        label_ar: "تفاصيل الهوية",
        button: {
          title: "View",
          title_ar: "عرض",
          type: "secondary",
          onClick: () => console.log("View clicked"),
        },
        extraItems: [
          {
            label: "UAE National ID",
            label_ar: "الهوية الوطنية الإماراتية",
            value: "78273890399292",
            value_ar: "78273890399292",
          },
          {
            label: "MOI Unified Number",
            label_ar: "رقم وزارة الداخلية الموحد",
            value: "330928",
            value_ar: "330928",
          },
          {
            label: "Archive Number",
            label_ar: "رقم الأرشيف",
            value: "7921",
            value_ar: "7921",
          },
        ],
      },
    ],
    defaultCode: `return [
  {
    label: "Identity Details",
    label_ar: "تفاصيل الهوية",
    button: {
      title: "View",
      title_ar: "عرض",
      type: "secondary",
      onClick: () => console.log("View clicked"),
    },
      radio: {
              id: "with-radio-row-1",
              checked: selectedRadioRow,
              label: "",
              label_ar: "",
              onChange: (id, checked) => {
                if (checked) {
                  setSelectedRadioRow(id);
                  console.log("Radio changed:", id);
                }
              },
            },
            checkbox: {
              id: "with-checkbox-row-1",
              checked: selectedCheckboxRow,
              label: "",
              label_ar: "",
              onChange: (id, checked) => {
                if (checked) {
                  setSelectedCheckboxRow(id);
                  console.log("Checkbox changed:", id);
                }
              },
            },
            selectSingle: {
              label: "Pick",
              label_ar: "اختر",
              options: SELECT_OPTIONS,
              checked: selectedSingleSelect,
              onChange: (v) => {
                setSelectedSingleSelect(v);
                console.log("Select Single changed:", v);
              },
              placeholder: "Select…",
              placeholder_ar: "اختر…",
            },
            selectMulti: {
              label: "Pick",
              label_ar: "اختر",
              options: SELECT_OPTIONS,
              checked: selectedMultiSelect,
              onChange: (v) => {
                setSelectedMultiSelect(v);
                console.log("Select Multi changed:", v);
              },
              placeholder: "Select…",
              placeholder_ar: "اختر…",
            },
            textInput: {
              label: "Input",
              label_ar: "المدخل",
              value: selectedTextInput,
              onChange: (v) => {
                setSelectedTextInput(v);
                console.log("Text Input changed:", v);
              },
              placeholder: "Enter…",
              placeholder_ar: "أدخل…",
            },
            dateField: {
              label: "Date",
              label_ar: "التاريخ",
              value: selectedDate,
              onChange: (v) => {
                setSelectedDate(v);
                console.log("Date changed:", v);
              },
              placeholder: "Select Date",
              placeholder_ar: "اختر التاريخ",
    extraItems: [
      { label: "UAE National ID", label_ar: "الهوية الوطنية الإماراتية", value: "78273890399292", value_ar: "78273890399292" },
      { label: "MOI Unified Number", label_ar: "رقم وزارة الداخلية الموحد", value: "330928", value_ar: "330928" },
      { label: "Archive Number", label_ar: "رقم الأرشيف", value: "7921", value_ar: "7921" },
    ]
  }
];`,
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
