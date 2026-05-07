import React from "react";
import axios from "axios";
import { UploadDocument } from "../UploadDocument/UploadDocument";
import { useUploadFile } from "@shared/hooks/useUploadFile";
import { useDownload } from "@/hooks/useDownload";
import { useDariDownload } from "@/hooks/useDariDownload";

import type { DocumentConfig, UploadDocumentsProps } from "@shared/types";

export type { DocumentConfig, UploadDocumentsProps };

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
  const { mutateAsync: uploadFile } = useUploadFile();
  const { download } = useDownload();
  const { download: downloadDari } = useDariDownload();

  const handleUpload = async (
    file: { name: string; uri: string; mimeType?: string } | null,
    doc: DocumentConfig,
  ) => {
    if (!file) return;

    try {
      const fetchResponse = await fetch(file.uri);
      const blob = await fetchResponse.blob();
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1] ?? result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const fileExtension = file.name.split(".").pop() ?? "";
      const fileType = file.mimeType || blob.type || "";
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
    <div className="flex flex-col flex-1 space-y-4">
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
              onFileChange({
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
              downloadDari({
                applicationID: doc.applicationID,
                applicationType: doc.applicationType ?? "",
                documentType: doc.documentType ?? "",
                subType: doc.subType ?? "",
              });
            } else if (apiType === "default" && doc?.downloadUrl) {
              download(doc.downloadUrl, doc.documentName);
            }
          }}
        />
      ))}
    </div>
  );
};
