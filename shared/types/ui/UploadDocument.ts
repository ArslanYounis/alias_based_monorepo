import type { ReactElement } from "react";

export interface UploadedFile {
  name: string;
  uri: string;
  size?: number;
  mimeType?: string;
}

export interface DocumentUploaderProps {
  documentName?: string;
  documentName_ar?: string;
  documentIcon?: ReactElement;
  plusIcon?: ReactElement;
  fileTypeErrorMessage?: string;
  fileTypeErrorMessage_ar?: string;
  fileSize?: number;
  fileSizeErrorMessage?: string;
  fileSizeErrorMessage_ar?: string;
  allowedTypes?: string[];
  isDark?: boolean;
  language?: "en" | "ar";
  theme?: "light" | "dark";
  type?: "default" | "base";
  onFileChange?: (file: UploadedFile | null) => void;
  isUploaded?: boolean;
  onDownloadClick?: () => void;
}
