import React from "react";
import { View } from "react-native";
import { UploadDocument } from "../UploadDocument/UploadDocument";
import { useDownload } from "../sharedHooks/useDownload";

import type { DocumentConfig, UploadDocumentsProps } from "@shared/types";
export type { DocumentConfig, UploadDocumentsProps };

export const UploadDocuments: React.FC<UploadDocumentsProps> = ({
  documents,
  language = "en",
  theme = "dark",
  type = "default",
  onFileChange,
}) => {
  const { download } = useDownload();

  const handleDownload = (downloadUrl?: string, documentName?: string) => {
    if (!downloadUrl) return;
    const fileName =
      documentName ?? downloadUrl.split("/").pop() ?? "download";
    download(downloadUrl, fileName);
  };

  return (
    <View className="flex flex-col gap-4 w-full">
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
          onDownloadClick={() => handleDownload(doc.downloadUrl, doc.documentName)}
        />
      ))}
    </View>
  );
};
