import type {
  ComponentConfig,
  ControlDefinition,
  IconType,
} from "@shared/types/dls.types";
import type { PromptProps } from "@shared/types";
import type { ComponentType } from "react";

const controls: {
  [K in keyof Omit<PromptProps, "language">]?: ControlDefinition<PromptProps>;
} & {
  propsOverride?: ControlDefinition<PromptProps>;
} = {
  title: {
    type: ["text", "code"],
    label: "Title",
    hasArabic: true,
    defaultValue: "Are you Sure?",
    defaultValueAr: "هل أنت متأكد؟",
    defaultCode: 'return "Are you Sure?"',
    defaultCodeAr: 'return "هل أنت متأكد؟"',
  },
  subtiltle: {
    type: ["text", "code"],
    label: "Sub Title",
    hasArabic: true,
    defaultValue: "Are you sure to perform this action?",
    defaultValueAr: "هل أنت متأكد من تنفيذ هذا الإجراء؟",
    defaultCode: 'return "Are you sure to perform this action?"',
    defaultCodeAr: 'return "هل أنت متأكد من تنفيذ هذا الإجراء؟"',
  },
  yesText: {
    type: ["text", "code"],
    label: "Yes Button Label",
    hasArabic: true,
    defaultValue: "Yes",
    defaultValueAr: "نعم",
    defaultCode: 'return "Yes"',
    defaultCodeAr: 'return "نعم"',
  },
  noText: {
    type: ["text", "code"],
    label: "No Button Label",
    hasArabic: true,
    defaultValue: "No",
    defaultValueAr: "لا",
    defaultCode: 'return "No"',
    defaultCodeAr: 'return "لا"',
  },
  onYesClick: {
    type: ["code"],
    label: "On Yes Button Click",
    defaultCode: "console.log('yes clicked')",
    isEvent: true,
  },
  onNoClick: {
    type: ["code"],
    label: "On No Button Click",
    defaultCode: "console.log('no clicked')",
    isEvent: true,
  },
  propsOverride: {
    type: ["propsOverride"],
    label: "Props Override",
    defaultCode: "return {}",
  },
};

export function createPromptConfig(
  Component: ComponentType<PromptProps>,
  icon: IconType
): ComponentConfig<PromptProps> {
  return {
    id: "prompt",
    icon,
    name: "Prompt",
    Component,
    controls,
  };
}
