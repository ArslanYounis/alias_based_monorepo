import { CreditCardIcon } from "lucide-react";
import { ComponentConfig } from "@/types/dls.types";
import { LargeComponent } from "@shared/components/LargeComponent";

const ApplicationDetailConfigs: ComponentConfig<{}> = {
  id: "largeComponent",
  icon: CreditCardIcon,
  name: "Large Component",
  Component: LargeComponent,
  controls: {
    propsOverride: {
      type: ["propsOverride"],
      label: "Props Override",
      defaultCode: "return {}",
    },
  },
};

export default ApplicationDetailConfigs;
