import type { ComponentConfig, ControlDefinition, IconType } from "@shared/types/dls.types";
import type { DateSelectProps } from "@shared/types";
import type { ComponentType } from "react";

const controls: {
  [K in keyof Omit<DateSelectProps, "language">]?: ControlDefinition<DateSelectProps>;
} & { fieldKey?: ControlDefinition<DateSelectProps>; propsOverride?: ControlDefinition<DateSelectProps> } = {
  fieldKey: { type: ["text"], label: "Field Key", hasArabic: false, isRequired: true, unique: true, defaultValue: "" },
  label: { type: ["text", "code"], label: "Label", hasArabic: true, defaultValue: "Date", defaultValueAr: "التاريخ", defaultCode: "return 'Date'", defaultCodeAr: "return 'التاريخ'" },
  value: { type: ["text", "code"], label: "Value", defaultValue: "", defaultCode: "return ''" },
  placeholder: { type: ["text", "code"], label: "Placeholder", hasArabic: true, defaultValue: "Select date", defaultValueAr: "اختر التاريخ", defaultCode: "return 'Select date'", defaultCodeAr: "return 'اختر التاريخ'" },
  required: { type: ["boolean", "code"], label: "Required?", defaultValue: false, defaultCode: "return false" },
  showInfoIcon: { type: ["boolean", "code"], label: "Show Info Icon", defaultValue: false, defaultCode: "return false" },
  tooltipText: { type: ["text", "code"], label: "Tooltip Text", hasArabic: true, defaultValue: "", defaultValueAr: "", defaultCode: "return ''", defaultCodeAr: "return ''", visibility: (props: DateSelectProps) => !!props.infoText },
  captionLeft: { type: ["text", "code"], label: "Caption Left", hasArabic: true, defaultValue: "", defaultValueAr: "", defaultCode: "return ''", defaultCodeAr: "return ''" },
  captionRight: { type: ["text", "code"], label: "Caption Right", hasArabic: true, defaultValue: "", defaultValueAr: "", defaultCode: "return ''", defaultCodeAr: "return ''" },
  onChange: { type: ["code"], label: "onChange", defaultCode: 'console.log("date changed", eventData)', isEvent: true, visibility: (props: DateSelectProps) => !props.disabled },
  propsOverride: { type: ["propsOverride"], label: "Props Override", defaultCode: "return {}" },
};

export function createDateSelectConfig(
  Component: ComponentType<DateSelectProps>,
  icon: IconType
): ComponentConfig<DateSelectProps> {
  return { id: "dateSelect", icon, name: "Date Select", Component, controls };
}
