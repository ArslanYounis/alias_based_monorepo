import { FolderSymlinkIcon } from "lucide-react";
import type { ComponentConfig } from "@shared/types/dls.types";
import ModalTitle, { type ModalTitleProps } from "./ModalTitle";

const ModalTitleConfigs: ComponentConfig<ModalTitleProps> = {
  id: "modalTitle",
  icon: FolderSymlinkIcon,
  name: "Modal Title",
  Component: ModalTitle,
  controls: {
    label: {
      type: ["text", "code"],
      label: "Label",
      hasArabic: true,
      defaultValue: "New Application",
      defaultValueAr: "New Application",
      defaultCode: 'return "New Application"',
      defaultCodeAr: 'return "New Application"',
    },
    propsOverride: {
      type: ["propsOverride"],
      label: "Props Override",
      defaultCode: "return {}",
    },
  },
};

export default ModalTitleConfigs;
