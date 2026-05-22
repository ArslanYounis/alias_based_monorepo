/* istanbul ignore file */
import type {
  ComponentConfig,
  IconType,
} from "@shared/types/dls.types";
import type { ApplicationMessageProps } from "./ApplicationMessage";
import type { ComponentType } from "react";

const controls: ComponentConfig<ApplicationMessageProps>["controls"] = {
  title: {
    type: ["text", "code"],
    label: "Title",
    hasArabic: true,
    defaultValue: "Application Submitted Successfully",
    defaultCode: "return 'Application Submitted Successfully'",
  },
  description: {
    type: ["text", "code"],
    label: "Description",
    hasArabic: true,
    defaultValue:
      "Your application has been submitted and is currently under review.",
    defaultCode:
      "return 'Your application has been submitted and is currently under review.'",
  },
  status: {
    type: ["select", "code"],
    label: "Status",
    options: ["success", "error", "information", "action"],
    defaultValue: "success",
    defaultCode: "return 'success'",
  },
  type: {
    type: ["select", "code"],
    label: "Input Type",
    options: ["text", "checkbox", "radio", "button"],
    defaultValue: "text",
    defaultCode: "return 'text'",
  },
  fieldType: {
    type: ["select", "code"],
    label: "Field Type",
    options: [
      "text",
      "date",
      "select",
      "textarea",
      "uaeid",
      "currency",
      "phone",
      "number",
    ],
    defaultValue: "text",
    defaultCode: "return 'text'",
  },
  selectType: {
    type: ["select", "code"],
    label: "Select Type",
    options: ["single", "multi"],
    defaultValue: "single",
    defaultCode: "return 'single'",
  },
  label: {
    type: ["text", "code"],
    label: "Label (EN)",
    hasArabic: true,
    defaultValue: "Reference Number",
    defaultCode: "return 'Reference Number'",
  },
  value: {
    type: ["code"],
    label: "Value",
    defaultCode: "return ''",
  },
  options: {
    type: ["select", "code"],
    label: "Options (Checkbox / Radio / Select)",
    defaultCode: `
return [
  { label: "Option 1", label_ar: "الخيار الأول", value: "option1" },
  { label: "Option 2", label_ar: "الخيار الثاني", value: "option2" }
];
      `.trim(),
  },
  required: {
    type: ["boolean", "code"],
    label: "Required",
    defaultValue: false,
    defaultCode: "return false",
  },
  hasError: {
    type: ["boolean", "code"],
    label: "Has Error",
    defaultValue: false,
    defaultCode: "return false",
  },
  errorMessage: {
    type: ["text", "code"],
    label: "Error Message (EN)",
    hasArabic: true,
    defaultValue: "",
    defaultCode: "return ''",
  },
  disabled: {
    type: ["boolean", "code"],
    label: "Disabled",
    defaultValue: false,
    defaultCode: "return false",
  },
  showInfoIcon: {
    type: ["boolean", "code"],
    label: "Show Info Icon",
    defaultValue: false,
    defaultCode: "return false",
  },
  tooltipText: {
    type: ["text", "code"],
    label: "Tooltip Text (EN)",
    hasArabic: true,
    defaultValue: "Tooltip Text",
    defaultCode: "return 'Tooltip Text'",
  },
  onClick: {
    type: ["code"],
    label: "Button Click Handler",
    defaultCode: "return () => console.log('Button clicked')",
    isEvent: true,
  },
  onInputChange: {
    type: ["code"],
    label: "Input Change Handler",
    defaultCode: "return console.log(eventData, 'eventData')",
    isEvent: true,
  },
  propsOverride: {
    type: ["propsOverride"],
    label: "Props Override",
    defaultCode: "return {}",
  },
};

export function createApplicationMessageConfig(
  Component: ComponentType<ApplicationMessageProps>,
  icon: IconType
): ComponentConfig<ApplicationMessageProps> {
  return {
    id: "applicationMessage",
    icon,
    name: "Application Message",
    Component,
    controls,
  };
}
