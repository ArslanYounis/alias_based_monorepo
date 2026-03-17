import { CreditCardIcon } from "lucide-react";
import type { ComponentConfig } from "@shared/types/dls.types";
import Signature from "./Signature";
import type { SignatureProps } from "./Signature";

const SignatureConfigs: ComponentConfig<SignatureProps> = {
  id: "signature",
  icon: CreditCardIcon,
  name: "Signature",
  Component: Signature,
  controls: {
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
  },
};

export default SignatureConfigs;
