import type {
  ComponentConfig,
  ControlDefinition,
  IconType,
} from "@shared/types/dls.types";
import type { UploadDocumentsProps } from "@shared/types";
import type { ComponentType } from "react";

const controls: {
  [K in keyof Omit<UploadDocumentsProps, "language">]?: ControlDefinition<UploadDocumentsProps>;
} & {
  propsOverride?: ControlDefinition<UploadDocumentsProps>;
} = {
  theme: {
    type: ["select"],
    label: "Theme",
    options: ["light", "dark"],
    defaultValue: "dark",
  },
  type: {
    type: ["select"],
    label: "Type",
    options: ["default", "base"],
    defaultValue: "default",
  },
  documents: {
    type: ["code"],
    label: "Documents",
    defaultValue: [
      {
        documentName: "text doc",
        documentName_ar: "text doc",
        isUploaded: false,
      },
    ],
    defaultCode: `return [{
  documentName: "text doc",
  documentName_ar: "text doc",
  isUploaded: false
}]`,
  },
  onFileChange: {
    type: ["code"],
    label: "On File Upload",
    defaultCode: "console.log('file changed', eventData)",
    isEvent: true,
  },
  propsOverride: {
    type: ["propsOverride"],
    label: "Props Override",
    defaultCode: "return {}",
  },
};

export function createUploadDocumentsConfig(
  Component: ComponentType<UploadDocumentsProps>,
  icon: IconType
): ComponentConfig<UploadDocumentsProps> {
  return {
    id: "uploadDocuments",
    icon,
    name: "Upload Documents",
    Component,
    controls,
  };
}
