import React from "react";
import { View } from "react-native";
import { File } from "expo-file-system";
import axios from "axios";
import { UploadDocument } from "../UploadDocument/UploadDocument";
import { useDownload } from "../sharedHooks/useDownload";
import { useUploadFile } from "@shared/hooks/useUploadFile";

import type { DocumentConfig, UploadDocumentsProps } from "@shared/types";
export type { DocumentConfig, UploadDocumentsProps };

export type DariDownloadParams = {
  applicationID: string;
  applicationType: string;
  documentType: string;
  subType: string;
};

export const UploadDocuments: React.FC<UploadDocumentsProps> = ({
  documents,
  language = "en",
  theme = "dark",
  type = "default",
  apiType = "default",
  handleUploadInternally = false,
  onFileChange,
  onUploadSuccess,
  onUploadFail,
}) => {
  const { download, downloadDari } = useDownload();
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
      const fileName = file.name;

      if (apiType === "dari") {
        const result = await axios.post("/dari/file/upload", {
          applicationType: doc?.applicationType,
          applicationId: String(doc?.applicationID ?? ""),
          documentType: doc?.documentType || doc?.uploadUrl || "",
          subType: "doc_" + Date.now(),
          file: {
            file_name: fileName,
            file_type: fileType,
            file_content: base64,
            file_identifier: fileName,
            file_extension: fileExtension,
          },
        });
        onUploadSuccess?.(result);
      } else {
        const payload = {
          name: `doc_name_${doc.wfiDocumentId ?? ""}`,
          file: {
            file_name: fileName,
            file_type: fileType,
            file_content: base64,
            file_identifier: "",
            file_extension: fileExtension,
          },
        };
        const result = await uploadFile({ payload, uploadUrl: doc.uploadUrl });
        onUploadSuccess?.(result);
      }
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
          onDownloadClick={() => {
            if (apiType === "dari" && doc?.applicationID) {
              downloadDari(
                {
                  applicationID: doc.applicationID,
                  applicationType: doc.applicationType ?? "",
                  documentType: doc.documentType ?? "",
                  subType: doc.subType ?? "",
                },
                doc.documentName,
              );
            } else if (apiType === "default" && doc?.downloadUrl) {
              handleDownload(doc.downloadUrl, doc.documentName);
            }
          }}
        />
      ))}
    </View>
  );
};
