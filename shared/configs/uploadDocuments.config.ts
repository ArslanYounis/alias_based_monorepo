import type { ComponentConfig, IconType } from "@shared/types/dls.types";
import type { UploadDocumentsProps } from "@shared/types";
import type { ComponentType } from "react";

export function createUploadDocumentsConfig(
  Component: ComponentType<UploadDocumentsProps>,
  icon: IconType,
): ComponentConfig<UploadDocumentsProps> {
  return {
    id: "uploadDocuments",
    icon,
    name: "Upload Documents",
    Component,
    controls: {
      type: {
        type: ["select"],
        label: "Type",
        options: ["default", "base"],
        defaultValue: "default",
      },
      apiType: {
        type: ["select"],
        label: "API Type",
        options: ["default", "dari"],
        defaultValue: "default",
      },
      handleUploadInternally: {
        type: ["boolean"],
        label: "Handle Upload Internally",
        defaultValue: false,
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
      onUploadSuccess: {
        type: ["code"],
        label: "On File Upload Success",
        defaultCode: "console.log('file uploaded', eventData)",
        isEvent: true,
      },
      onUploadFail: {
        type: ["code"],
        label: "On File Upload fail",
        defaultCode: "console.log('file upload failed', eventData)",
        isEvent: true,
      },
      propsOverride: {
        type: ["propsOverride"],
        label: "Props Override",
        defaultCode: "return {}",
      },
    },
  };
}
