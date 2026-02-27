import { InfoIcon } from "lucide-react";
import ApplicationMessage, {
  ApplicationMessageProps,
} from "./ApplicationMessage";

export interface ComponentConfig<T> {
  id: string;
  icon: React.FC | typeof InfoIcon;
  name: string;
  Component: React.FC<T>;
  controls: Record<string, unknown>;
}

const ApplicationMessageConfigs: ComponentConfig<ApplicationMessageProps> = {
  id: "applicationMessage",
  icon: InfoIcon,
  name: "Application Message",
  Component: ApplicationMessage,

  controls: {
    title: {
      type: ["text", "code"],
      label: "Title",
      defaultValue: "Application Submitted Successfully",
      defaultCode: "return 'Application Submitted Successfully'",
    },
    description: {
      type: ["text", "code"],
      label: "Description",
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
      defaultValue: "Reference Number",
      defaultCode: "return 'Reference Number'",
    },
    label_ar: {
      type: ["text", "code"],
      label: "Label (AR)",
      defaultValue: "رقم المرجع",
      defaultCode: "return 'رقم المرجع'",
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
      defaultValue: "",
      defaultCode: "return ''",
    },
    errorMessage_ar: {
      type: ["text", "code"],
      label: "Error Message (AR)",
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
      defaultValue: "Tooltip Text",
      defaultCode: "return 'Tooltip Text'",
    },
    tooltipText_ar: {
      type: ["text", "code"],
      label: "Tooltip Text (AR)",
      defaultValue: "نص تلميح الأداة",
      defaultCode: "return 'نص تلميح الأداة'",
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
  },
};

export default ApplicationMessageConfigs;
