import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Plus, FileText } from "lucide-react-native";
import * as DocumentPicker from "expo-document-picker";
import SharedLanguageSwitchRenderer from "@shared/components/SharedLanguageSwitchRenderer";

export interface DocumentUploaderProps {
  documentName?: string;
  documentName_ar?: string;
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
  onFileChange?: (
    file: { name: string; uri: string; size?: number; mimeType?: string } | null
  ) => void;
  isUploaded?: boolean;
  onDownloadClick?: () => void;
}

export const UploadDocument: React.FC<DocumentUploaderProps> = ({
  documentName,
  documentName_ar,
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

  useEffect(() => {
    setHasFile(isUploaded);
  }, [isUploaded]);

  const checkFileAllowed = useCallback(
    (name: string) => {
      if (!allowedTypes || allowedTypes.length === 0) return true;
      const ext = name.split(".").pop()?.toLowerCase();
      return allowedTypes.map((t) => t.toLowerCase()).includes(ext || "");
    },
    [allowedTypes]
  );

  const checkFileSize = useCallback(
    (size?: number) => {
      if (!fileSize || !size) return true;
      return size <= fileSize;
    },
    [fileSize]
  );

  const openFilePicker = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) return;

      const asset = result.assets[0];
      if (!asset) return;

      if (!checkFileAllowed(asset.name)) {
        setErrorType("fileType");
        setError("fileType");
        setHasFile(false);
        onFileChange?.(null);
        return;
      }

      if (!checkFileSize(asset.size)) {
        setErrorType("fileSize");
        setError(fileSizeErrorMessage);
        setHasFile(false);
        onFileChange?.(null);
        return;
      }

      setError(null);
      setErrorType(null);
      setHasFile(true);
      onFileChange?.({
        name: asset.name,
        uri: asset.uri,
        size: asset.size,
        mimeType: asset.mimeType,
      });
    } catch {}
  }, [checkFileAllowed, checkFileSize, onFileChange, fileSizeErrorMessage]);

  const isRtl = language === "ar";

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

  return (
    <View className={`flex flex-col ${isRtl ? "flex-row-reverse" : ""}`}>
      <View className="flex-row items-center gap-2">
        <View
          className={`flex-1 h-[50px] flex-row items-center px-4 rounded-xxs ${borderColorClass} ${backgroundColorClass}`}
        >
          {!hasFile && (
            <TouchableOpacity
              className={`mr-2 ${textColorClass}`}
              onPress={openFilePicker}
            >
              <Plus size={18} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            className={`flex-1 font-normal ${textColorClass}`}
            onPress={() => {
              if (!hasFile) openFilePicker();
            }}
            activeOpacity={hasFile ? 1 : 0.7}
          >
            <Text className={`${textColorClass} text-m font-normal`}>
              {hasFile ? (
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
              ) : (
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
              )}
            </Text>
          </TouchableOpacity>

          {hasFile && (
            <TouchableOpacity
              className={`ml-2 ${textColorClass}`}
              onPress={() => onDownloadClick?.()}
            >
              <FileText size={24} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {error && errorType && (
        <Text className="text-form-fields-error text-sm mt-1">
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
        </Text>
      )}

      {!error && allowedTypes && allowedTypes.length > 0 && !hasFile && (
        <Text className={`${textColorClass} text-sm mt-1`}>
          <SharedLanguageSwitchRenderer
            language={language}
            value={`Accepted formats: ${(allowedTypes ?? []).join(", ")}`}
            value_ar={`التنسيقات المقبولة: ${(allowedTypes ?? []).join(", ")}`}
          />
        </Text>
      )}
    </View>
  );
};
