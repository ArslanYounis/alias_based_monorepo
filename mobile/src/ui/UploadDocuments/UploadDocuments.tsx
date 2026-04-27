import React from "react";
import { View } from "react-native";
import { File } from "expo-file-system";
import { UploadDocument } from "../UploadDocument/UploadDocument";
import { useDownload } from "../sharedHooks/useDownload";
import { useUploadFile } from "@shared/hooks/useUploadFile";

import type { DocumentConfig, UploadDocumentsProps } from "@shared/types";
export type { DocumentConfig, UploadDocumentsProps };

export const UploadDocuments: React.FC<UploadDocumentsProps> = ({
  documents,
  language = "en",
  theme = "dark",
  type = "default",
  handleUploadInternally = false,
  onFileChange,
  onUploadSuccess,
  onUploadFail,
}) => {
  const { download } = useDownload();
  const { mutateAsync: uploadFile } = useUploadFile();

  const handleDownload = (downloadUrl?: string, documentName?: string) => {
    if (!downloadUrl) return;
    const fileName = documentName ?? downloadUrl.split("/").pop() ?? "download";
    download(downloadUrl, fileName);
  };

  const handleUpload = async (
    file: { name: string; uri: string; mimeType?: string } | null,
    doc: DocumentConfig
  ) => {
    if (!file) return;

    try {
      const fsFile = new File(file.uri);
      const bytes = await fsFile.bytes();
      const TABLE =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      let base64 = "";
      for (let i = 0; i < bytes.length; i += 3) {
        const b0 = bytes[i];
        const b1 = i + 1 < bytes.length ? bytes[i + 1] : 0;
        const b2 = i + 2 < bytes.length ? bytes[i + 2] : 0;
        base64 += TABLE[b0 >> 2];
        base64 += TABLE[((b0 & 0x3) << 4) | (b1 >> 4)];
        base64 +=
          i + 1 < bytes.length ? TABLE[((b1 & 0xf) << 2) | (b2 >> 6)] : "=";
        base64 += i + 2 < bytes.length ? TABLE[b2 & 0x3f] : "=";
      }

      const fileExtension = file.name.split(".").pop() ?? "";
      const fileType = file.mimeType ?? "";

      const payload = {
        name: `doc_name_${doc.wfiDocumentId ?? ""}`,
        file: {
          file_name: file.name,
          file_type: fileType,
          file_content: base64,
          file_identifier: "",
          file_extension: fileExtension,
        },
      };

      const result = await uploadFile({ payload, uploadUrl: doc.uploadUrl });
      onUploadSuccess?.(result);
    } catch (error) {
      onUploadFail?.(error);
    }
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
            if (!doc?.isUploaded) {
              onFileChange?.({
                file,
                uploadUrl: doc?.uploadUrl as string,
                document: doc,
              });
              if (handleUploadInternally) {
                handleUpload(file, doc);
              }
            }
          }}
          onDownloadClick={() =>
            handleDownload(doc.downloadUrl, doc.documentName)
          }
        />
      ))}
    </View>
  );
};
