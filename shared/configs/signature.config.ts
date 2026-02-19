import type {
  ComponentConfig,
  ControlDefinition,
  IconType,
} from "@shared/types/dls.types";
import type { SignatureProps } from "@shared/types";
import type { ComponentType } from "react";

const controls: {
  [K in keyof Omit<SignatureProps, "language">]?: ControlDefinition<SignatureProps>;
} & {
  propsOverride?: ControlDefinition<SignatureProps>;
} = {
  title: {
    type: ["text", "code"],
    label: "Title",
    hasArabic: true,
    defaultValue: "Sign to Approve",
    defaultValueAr: "Sign to Approve",
    defaultCode: 'return "Sign to Approve"',
    defaultCodeAr: 'return "Sign to Approve"',
  },
  theme: {
    type: ["select"],
    label: "Theme",
    options: ["light", "dark"],
    defaultValue: "dark",
  },
  onSubmit: {
    type: ["code"],
    label: "On Submit Signature",
    defaultCode: "console.log('signature submitted', eventData)",
    isEvent: true,
  },
  propsOverride: {
    type: ["propsOverride"],
    label: "Props Override",
    defaultCode: "return {}",
  },
};

export function createSignatureConfig(
  Component: ComponentType<SignatureProps>,
  icon: IconType
): ComponentConfig<SignatureProps> {
  return {
    id: "signature",
    icon,
    name: "Signature",
    Component,
    controls,
  };
}
