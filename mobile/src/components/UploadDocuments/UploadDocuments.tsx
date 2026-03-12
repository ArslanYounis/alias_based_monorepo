import React from "react";
import { View, Linking } from "react-native";
import UploadDocument from "./UploadDocument";

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
}

export interface UploadDocumentsProps {
  documents: DocumentConfig[];
  theme?: "light" | "dark";
  language?: "en" | "ar";
  type?: "default" | "base";
  onFileChange?: (props: {
    file: {
      name: string;
      uri: string;
      size?: number;
      mimeType?: string;
    } | null;
    uploadUrl: string;
  }) => void;
}

const UploadDocuments: React.FC<UploadDocumentsProps> = ({
  documents,
  language = "en",
  theme = "dark",
  type = "default",
  onFileChange,
}) => {
  const handleDownload = (downloadUrl?: string) => {
    if (!downloadUrl) return;
    // On mobile, open the download URL in the system browser / native handler
    Linking.openURL(downloadUrl).catch((e) =>
      console.error("Failed to open download URL", e)
    );
  };

  return (
    <View className="flex flex-1 flex-col">
      {documents?.map((doc, idx) => (
        <UploadDocument
          key={idx}
          documentName={doc.documentName}
          documentName_ar={doc.documentName_ar}
          allowedTypes={doc.allowedTypes}
          fileTypeErrorMessage={doc.fileTypeErrorMessage}
          fileTypeErrorMessage_ar={doc.fileTypeErrorMessage_ar}
          fileSize={doc.fileSize}
          fileSizeErrorMessage={doc.fileSizeErrorMessage}
          fileSizeErrorMessage_ar={doc.fileSizeErrorMessage_ar}
          isDark={doc.isDark}
          theme={theme}
          type={type}
          language={language}
          isUploaded={doc?.isUploaded}
          onFileChange={(file) => {
            if (onFileChange && !doc?.isUploaded) {
              onFileChange({ file, uploadUrl: doc?.uploadUrl as string });
            }
          }}
          onDownloadClick={() => handleDownload(doc.downloadUrl)}
        />
      ))}
    </View>
  );
};

export default UploadDocuments;
