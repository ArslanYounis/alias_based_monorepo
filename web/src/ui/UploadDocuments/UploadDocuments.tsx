import React, { useEffect, useState } from "react";
import { UploadDocument } from "../UploadDocument/UploadDocument";
import { useGetDownloadFile } from "@/hooks/useGetDownloadFile";
import { useUploadFile } from "@shared/hooks/useUploadFile";

import type { DocumentConfig, UploadDocumentsProps } from "@shared/types";

import { useGetDariDownloadFile } from "@shared/hooks/useGetDariDownloadFile";

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
  const [downloadUrl, setDownloadUrl] = useState<string | undefined>(undefined);
  const [dariParams, setDariParams] = useState<DariDownloadParams | undefined>(
    undefined
  );

  const { data: downloadBlob, isSuccess: isDownloadSuccess } =
    useGetDownloadFile(downloadUrl);

  const { mutateAsync: uploadFile } = useUploadFile();

  const { data: dariFile, isSuccess: isDariSuccess } =
    useGetDariDownloadFile(dariParams);

  const handleUpload = async (
    file: { name: string; uri: string; mimeType?: string } | null,
    doc: DocumentConfig
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

  useEffect(() => {
    let blob: Blob | undefined;
    let fileName = "document";

    // DEFAULT FLOW
    if (downloadUrl && isDownloadSuccess && downloadBlob) {
      blob = downloadBlob;
    }

    // DARI FLOW
    if (dariParams && isDariSuccess && dariFile) {
      blob = dariFile.blob;
      fileName = dariFile.fileName || fileName;
    }

    if (!blob) return;

    try {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;

      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Failed to download file", e);
    } finally {
      setDownloadUrl(undefined);
      setDariParams(undefined);
    }
  }, [
    isDownloadSuccess,
    downloadBlob,
    downloadUrl,
    isDariSuccess,
    dariFile,
    dariParams,
  ]);

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
              setDariParams({
                applicationID: doc?.applicationID ?? "",
                applicationType: doc?.applicationType ?? "",
                documentType: doc?.documentType ?? "",
                subType: doc?.subType ?? "",
              });
            } else if (apiType === "default" && doc?.downloadUrl) {
              setDownloadUrl(doc.downloadUrl);
            }
          }}
        />
      ))}
    </div>
  );
};
