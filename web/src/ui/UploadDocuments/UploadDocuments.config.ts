import { File } from "lucide-react";
import type { ComponentConfig } from "@shared/types/dls.types";
import { UploadDocuments } from "./UploadDocuments";
import type { UploadDocumentsProps } from "./UploadDocuments";

const UploadDocumentsConfigs: ComponentConfig<UploadDocumentsProps> = {
  id: "uploadDocuments",
  icon: File,
  name: "Upload Documents",
  Component: UploadDocuments,
  controls: {
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

export default UploadDocumentsConfigs;
