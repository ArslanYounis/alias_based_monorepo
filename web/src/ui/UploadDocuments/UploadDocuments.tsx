import React, { useEffect, useState } from "react";
import { UploadDocument } from "../UploadDocument/UploadDocument";
import { useGetDownloadFile } from "@/hooks/useGetDownloadFile";

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
  onFileChange?: (props: { file: File | null; uploadUrl: string }) => void;
}

export const UploadDocuments: React.FC<UploadDocumentsProps> = ({
  documents,
  language = "en",
  theme = "dark",
  type = "default",
  onFileChange,
}) => {
  const [downloadUrl, setDownloadUrl] = useState<string | undefined>(undefined);

  const { data: downloadBlob, isSuccess: isDownloadSuccess } =
    useGetDownloadFile(downloadUrl);

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
            if (onFileChange && !doc?.isUploaded) {
              onFileChange({ file, uploadUrl: doc?.uploadUrl as string });
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
