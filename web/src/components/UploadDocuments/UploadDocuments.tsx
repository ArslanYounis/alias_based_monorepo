import type { UploadDocumentsProps } from "@shared/types";
import React, { useCallback } from "react";

export type { UploadDocumentsProps };

export const UploadDocuments: React.FC<UploadDocumentsProps> = ({
  theme = "dark",
  type = "default",
  documents = [],
  onFileChange,
  language = "en",
}) => {
  const handleFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      onFileChange?.({ file, url } as unknown as Parameters<NonNullable<UploadDocumentsProps["onFileChange"]>>[0]);
    },
    [onFileChange]
  );

  return (
    <div
      className={`rounded-lg p-4 ${theme === "dark" ? "bg-neutral-800" : "bg-neutral-100"}`}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <h3 className="text-lg font-bold text-text-default mb-4">
        {language === "ar" ? "رفع المستندات" : "Upload Documents"}
      </h3>
      <ul className="list-disc list-inside space-y-2 text-text-default mb-4">
        {documents.map((doc, i) => (
          <li key={i}>
            {language === "ar" ? doc.documentName_ar ?? doc.documentName : doc.documentName}
            {doc.isUploaded && (
              <span className="ml-2 text-green-600">✓</span>
            )}
          </li>
        ))}
      </ul>
      <label className="inline-flex items-center gap-2 px-4 py-2 rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 cursor-pointer text-text-default">
        <input
          type="file"
          className="sr-only"
          accept=".pdf,.doc,.docx,image/*"
          onChange={handleFile}
        />
        {language === "ar" ? "اختر ملف" : "Choose file"}
      </label>
    </div>
  );
};
