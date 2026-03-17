import { FolderSymlinkIcon } from "lucide-react";
import type { ComponentConfig } from "@shared/types/dls.types";
import ModalSteps, { type ModalStepsProps } from "./ModalSteps";

const ModalStepsConfigs: ComponentConfig<ModalStepsProps> = {
  id: "modalSteps",
  icon: FolderSymlinkIcon,
  name: "Modal Steps",
  Component: ModalSteps,
  controls: {
    title: {
      type: ["text", "code"],
      label: "Title",
      hasArabic: true,
      defaultValue: "Confirm and create",
      defaultValueAr: "Confirm and create",
      defaultCode: 'return "Confirm and create"',
      defaultCodeAr: 'return "Confirm and create"',
    },
    subText: {
      type: ["text", "code"],
      label: "Sub Text",
      hasArabic: true,
      defaultValue: "Step 3 of 3",
      defaultValueAr: "Step 3 of 3",
      defaultCode: 'return "Step 3 of 3"',
      defaultCodeAr: 'return "Step 3 of 3"',
    },
    propsOverride: {
      type: ["propsOverride"],
      label: "Props Override",
      defaultCode: "return {}",
    },
  },
};

export default ModalStepsConfigs;
