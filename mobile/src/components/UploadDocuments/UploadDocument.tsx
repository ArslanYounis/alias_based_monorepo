import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
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
  onFileChange?: (file: { name: string; uri: string; size?: number; mimeType?: string } | null) => void;
  isUploaded?: boolean;
  onDownloadClick?: () => void;
}

const UploadDocument: React.FC<DocumentUploaderProps> = ({
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
  const [errorType, setErrorType] = useState<"fileType" | "fileSize" | null>(null);
  const [hasFile, setHasFile] = useState<boolean>(isUploaded);

  // Update internal state when isUploaded prop changes
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
      onFileChange?.({ name: asset.name, uri: asset.uri, size: asset.size, mimeType: asset.mimeType });
    } catch {
      // Picker cancelled or unavailable — silently ignore
    }
  }, [checkFileAllowed, checkFileSize, onFileChange, fileSizeErrorMessage]);

  const isRtl = language === "ar";

  const containerStyle = [
    styles.row,
    type === "default"
      ? error
        ? styles.borderError
        : styles.borderTransparent
      : styles.borderStroke,
    type === "default"
      ? error
        ? styles.bgTransparent
        : styles.bgDefault
      : styles.bgBase,
  ];

  return (
    <View style={[styles.wrapper, isRtl && styles.rtl]}>
      <View style={styles.inputRow}>
        <View style={containerStyle}>
          {!hasFile && (
            <TouchableOpacity style={styles.plusIcon} onPress={openFilePicker}>
              <Plus size={18} color="#ffffff" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.labelArea}
            onPress={() => { if (!hasFile) openFilePicker(); }}
            activeOpacity={hasFile ? 1 : 0.7}
          >
            <Text style={styles.labelText}>
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
              style={styles.docIcon}
              onPress={() => onDownloadClick?.()}
            >
              <FileText size={24} color="#ffffff" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {error && errorType && (
        <Text style={styles.errorText}>
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
        <Text style={styles.hintText}>
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

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: "column",
  },
  rtl: {
    // RTL handled via Text/View writingDirection if needed
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  row: {
    flex: 1,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  // border variants
  borderError: {
    borderWidth: 1,
    borderColor: "#EF4444", // form-fields-error
  },
  borderTransparent: {
    borderWidth: 1,
    borderColor: "transparent",
  },
  borderStroke: {
    borderWidth: 1,
    borderColor: "#3A3A44", // cards-stroke
  },
  // background variants
  bgDefault: {
    backgroundColor: "#2A2A32", // form-fields-file-upload-default
  },
  bgTransparent: {
    backgroundColor: "transparent",
  },
  bgBase: {
    backgroundColor: "#1E1E26", // cards-base-l1
  },
  plusIcon: {
    marginRight: 8,
  },
  labelArea: {
    flex: 1,
  },
  labelText: {
    color: "#ffffff", // text-text-default
    fontSize: 14,
    fontWeight: "400",
  },
  docIcon: {
    marginLeft: 8,
  },
  errorText: {
    color: "#EF4444", // form-fields-error
    fontSize: 12,
    marginTop: 4,
  },
  hintText: {
    color: "#ffffff", // text-text-default
    fontSize: 12,
    marginTop: 4,
  },
});

export default UploadDocument;
