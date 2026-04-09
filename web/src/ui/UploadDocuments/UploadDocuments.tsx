import React, { useEffect, useState } from "react";
import { UploadDocument } from "../UploadDocument/UploadDocument";
import { useGetDownloadFile } from "@/hooks/useGetDownloadFile";
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
  const [downloadUrl, setDownloadUrl] = useState<string | undefined>(undefined);

  const { data: downloadBlob, isSuccess: isDownloadSuccess } =
    useGetDownloadFile(downloadUrl);

  const { mutateAsync: uploadFile } = useUploadFile();

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
    if (!isDownloadSuccess || !downloadBlob || !downloadUrl) return;

    try {
      const blob = downloadBlob as Blob;

      const mime = blob.type || "";
      const ext = mime.split("/")[1]?.split(";")[0] ?? "bin";

      const filename = `document.${ext}`;

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;

      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Failed to download file", e);
    } finally {
      // reset so same file can be downloaded again
      setDownloadUrl(undefined);
    }
  }, [isDownloadSuccess, downloadBlob, downloadUrl]);

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
            if (!doc?.isUploaded) {
              onFileChange?.({ file, uploadUrl: doc?.uploadUrl as string });
              if (handleUploadInternally) {
                handleUpload(file, doc);
              }
            }
          }}
          onDownloadClick={() => {
            if (doc.downloadUrl) {
              setDownloadUrl(doc.downloadUrl);
            }
          }}
        />
      ))}
    </div>
  );
};
