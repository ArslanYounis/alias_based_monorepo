import React, { useState, useRef, useCallback, useEffect } from "react";
import { Plus } from "lucide-react";
import SharedLanguageSwitchRenderer from "@shared/components/SharedLanguageSwitchRenderer";
import Document from "@/assets/svg/document";

export interface DocumentUploaderProps {
  documentName?: string;
  documentName_ar?: string;
  documentIcon?: React.ReactElement;
  plusIcon?: React.ReactElement;
  fileTypeErrorMessage?: string;
  fileTypeErrorMessage_ar?: string;
  fileSize?: number;
  fileSizeErrorMessage?: string;
  fileSizeErrorMessage_ar?: string;
  allowedTypes?: string[];
  isDark?: boolean;
  language?: "en" | "ar";
  theme?: "light" | "dark";
  type?: "default" | "base";
  onFileChange?: (file: File | null) => void;
  isUploaded?: boolean;
  onDownloadClick?: () => void;
}

export const UploadDocument: React.FC<DocumentUploaderProps> = ({
  documentName,
  documentName_ar,
  documentIcon = <Document width={24} height={24} />,
  plusIcon = <Plus size={18} />,
  fileTypeErrorMessage = "File not the correct format",
  fileTypeErrorMessage_ar = "الملف ليس بالتنسيق الصحيح",
  fileSize,
  fileSizeErrorMessage = `Your file exceeds file size limit of ${fileSize} bytes`,
  fileSizeErrorMessage_ar = `يتجاوز ملفك حد حجم الملف البالغ ${fileSize} بايت`,
  allowedTypes,
  language = "en",
  type = "default",
  onFileChange,
  isUploaded = false,
  onDownloadClick,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<"fileType" | "fileSize" | null>(
    null
  );
  const [hasFile, setHasFile] = useState<boolean>(isUploaded);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update internal state when isUploaded prop changes
  useEffect(() => {
    setHasFile(isUploaded);
  }, [isUploaded]);

  const borderColorClass =
    type === "default"
      ? error
        ? "border border-form-fields-error"
        : "border border-transparent"
      : "border border-cards-stroke";

  const backgroundColorClass =
    type === "default"
      ? error
        ? "bg-transparent"
        : "bg-form-fields-file-upload-default"
      : "bg-cards-base-l1";

  const textColorClass = "text-text-default";

  const checkFileAllowed = useCallback(
    (file: File) => {
      if (!allowedTypes || allowedTypes.length === 0) return true;
      const ext = file.name.split(".").pop()?.toLowerCase();
      return allowedTypes.map((t) => t.toLowerCase()).includes(ext || "");
    },
    [allowedTypes]
  );

  const checkFileSize = useCallback(
    (file: File) => {
      if (!fileSize) return true;
      return file.size <= fileSize;
    },
    [fileSize]
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];

        if (!checkFileAllowed(file)) {
          setErrorType("fileType");
          setError("fileType"); // Set placeholder, SharedLanguageSwitchRenderer will handle display
          setHasFile(false);
          onFileChange?.(null);
          return;
        }
        // File size check
        if (!checkFileSize(file)) {
          setErrorType("fileSize");
          setError(fileSizeErrorMessage);
          setHasFile(false);
          onFileChange?.(null);
          return;
        }
        setError(null);
        setErrorType(null);
        setHasFile(true);
        onFileChange?.(file);
      } else {
        setError(null);
        setErrorType(null);
        setHasFile(false);
        onFileChange?.(null);
      }
    },
    [checkFileAllowed, checkFileSize, onFileChange, fileSizeErrorMessage]
  );

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const displayedText = () => {
    if (hasFile) {
      return (
        <>
          <SharedLanguageSwitchRenderer
            language={language}
            value="Uploaded "
            value_ar="تم رفع "
          />
          <SharedLanguageSwitchRenderer
            language={language}
            value={documentName}
            value_ar={documentName_ar}
          />
        </>
      );
    }
    return (
      <>
        <SharedLanguageSwitchRenderer
          language={language}
          value="Add "
          value_ar="إضافة "
        />
        <SharedLanguageSwitchRenderer
          language={language}
          value={documentName}
          value_ar={documentName_ar}
        />
      </>
    );
  };

  return (
    <div
      className="flex flex-col flex-1"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="flex items-center gap-xs">
        <div
          className={`w-full h-12 flex items-center px-m font-bold text-m rounded-xxs ${backgroundColorClass} ${borderColorClass} focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#169F9F]`}
        >
          {!hasFile && (
            <div
              className={`mr-2 cursor-pointer ${textColorClass}`}
              onClick={openFilePicker}
            >
              {plusIcon}
            </div>
          )}

          <div
            className={`flex-grow font-normal ${
              hasFile ? "" : "cursor-pointer"
            } ${textColorClass}`}
            onClick={() => {
              if (!hasFile) {
                openFilePicker();
              }
            }}
          >
            {displayedText()}
          </div>

          {hasFile && (
            <div
              className={`ml-2 cursor-pointer ${textColorClass}`}
              onClick={(e) => {
                e.stopPropagation();
                onDownloadClick?.();
              }}
            >
              {documentIcon}
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {error && errorType && (
        <div className="text-form-fields-error text-s mt-1">
          {errorType === "fileType" ? (
            <SharedLanguageSwitchRenderer
              language={language}
              value={fileTypeErrorMessage}
              value_ar={fileTypeErrorMessage_ar}
            />
          ) : errorType === "fileSize" ? (
            <SharedLanguageSwitchRenderer
              language={language}
              value={fileSizeErrorMessage}
              value_ar={fileSizeErrorMessage_ar}
            />
          ) : (
            error
          )}
        </div>
      )}

      {!error && allowedTypes && allowedTypes.length > 0 && !hasFile && (
        <div className={`${textColorClass} text-s mt-1`}>
          <SharedLanguageSwitchRenderer
            language={language}
            value={`Accepted formats: ${(allowedTypes ?? []).join(", ")}`}
            value_ar={`التنسيقات المقبولة: ${(allowedTypes ?? []).join(", ")}`}
          />
        </div>
      )}
    </div>
  );
};
