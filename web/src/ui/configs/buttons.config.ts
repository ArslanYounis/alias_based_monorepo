import { MailboxIcon } from "lucide-react";
import { Buttons, type NewButtonProps } from "../Buttons";
import type { ComponentConfig } from "@/types/dls.types";

const ButtonsConfigs: ComponentConfig<NewButtonProps> = {
  id: "button",
  icon: MailboxIcon,
  name: "Button",
  Component: Buttons,
  controls: {
    title: {
      type: ["text", "code"],
      label: "Title",
      hasArabic: true,
      defaultValue: "DLS Button",
      defaultValueAr: "DLS Button",
      defaultCode: "return 'Code Button Title'",
      defaultCodeAr: "return 'Code Button Title'",
    },
    fullWidth: {
      type: ["boolean", "code"],
      label: "Full Width?",
      defaultValue: false,
      defaultCode: "return false",
    },
    type: {
      type: ["select", "code"],
      label: "Type",
      options: ["primary", "secondary", "tertiary", "text-link", "delete"],
      defaultValue: "primary",
      defaultCode: "return 'primary'",
    },
    size: {
      type: ["select"],
      label: "Size",
      options: ["s", "m", "l"],
      defaultValue: "m",
    },
    disabled: {
      type: ["boolean", "code"],
      label: "Disabled",
      defaultValue: false,
      defaultCode: "return false",
    },
    onClick: {
      type: ["code"],
      label: "onClick",
      defaultCode: 'console.log("button click",props.label)',
      isEvent: true,
    },
    propsOverride: {
      type: ["propsOverride"],
      label: "Props Override",
      defaultCode: "return {}",
    },
  },
};

export default ButtonsConfigs;
