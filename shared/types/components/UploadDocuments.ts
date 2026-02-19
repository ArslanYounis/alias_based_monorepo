export interface UploadDocumentsDocument {
  documentName: string;
  documentName_ar?: string;
  isUploaded: boolean;
}

export interface UploadDocumentsProps {
  theme?: "light" | "dark";
  type?: "default" | "base";
  documents?: UploadDocumentsDocument[];
  onFileChange?: (eventData: unknown) => void;
  language?: "en" | "ar";
}
