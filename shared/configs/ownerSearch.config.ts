import type {
  ComponentConfig,
  ControlDefinition,
  IconType,
} from "@shared/types/dls.types";
import type { OwnerSearchProps } from "@shared/types";
import type { ComponentType } from "react";

const controls: {
  [K in keyof Omit<OwnerSearchProps, "language">]?: ControlDefinition<OwnerSearchProps>;
} & {
  propsOverride?: ControlDefinition<OwnerSearchProps>;
} = {
  title: {
    type: ["text", "code"],
    label: "Title",
    hasArabic: true,
    defaultValue: "",
    defaultValueAr: "",
    defaultCode: 'return ""',
    defaultCodeAr: 'return ""',
  },
  theme: {
    type: ["select"],
    label: "Theme",
    options: ["light", "dark"],
    defaultValue: "dark",
  },
  ownerTypeOptions: {
    type: ["code"],
    label: "Owner Type Options",
    defaultValue: {},
    defaultCode: `return {
  company: 'By Company Owner',
  company_ar: 'بواسطة مالك الشركة',
  owner: 'By Owner',
  owner_ar: 'بواسطة المالك',
}`,
  },
  selected: {
    type: ["code"],
    label: "Selected Owners",
    defaultValue: [],
    defaultCode: "return []",
  },
  onSubmit: {
    type: ["code"],
    label: "On Submit",
    defaultCode: "console.log('owner search submit', eventData)",
    isEvent: true,
  },
  propsOverride: {
    type: ["propsOverride"],
    label: "Props Override",
    defaultCode: "return {}",
  },
};

export function createOwnerSearchConfig(
  Component: ComponentType<OwnerSearchProps>,
  icon: IconType
): ComponentConfig<OwnerSearchProps> {
  return {
    id: "ownerSearch",
    icon,
    name: "Owner Search",
    Component,
    controls,
  };
}
