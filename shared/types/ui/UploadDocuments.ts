import type { UploadedFile } from "./UploadDocument";

export interface DocumentConfig {
  documentName?: string;
  documentName_ar?: string;
  allowedTypes?: string[];
  fileTypeErrorMessage?: string;
  fileTypeErrorMessage_ar?: string;
  fileSize?: number;
  fileSizeErrorMessage?: string;
  fileSizeErrorMessage_ar?: string;
  isDark?: boolean;
  uploadUrl?: string;
  downloadUrl?: string;
  isUploaded?: boolean;
  wfiDocumentId?: string | number;
}

export interface UploadDocumentsProps {
  documents: DocumentConfig[];
  theme?: "light" | "dark";
  language?: "en" | "ar";
  type?: "default" | "base";
  handleUploadInternally?: boolean;
  onFileChange?: (props: {
    file: UploadedFile | null;
    uploadUrl: string;
  }) => void;
  onUploadSuccess?: (response: unknown) => void;
  onUploadFail?: (error: unknown) => void;
}
