import type { UploadDocumentsProps } from "@shared/types";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export type { UploadDocumentsProps };

export const UploadDocuments: React.FC<UploadDocumentsProps> = ({
  theme = "dark",
  documents = [],
  onFileChange,
  language = "en",
}) => {
  return (
    <View style={{ padding: 16, backgroundColor: theme === "dark" ? "#262626" : "#f5f5f5", borderRadius: 8 }}>
      <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 16 }}>
        {language === "ar" ? "رفع المستندات" : "Upload Documents"}
      </Text>
      {documents.map((doc, i) => (
        <Text key={i} style={{ marginBottom: 4 }}>
          {language === "ar" ? doc.documentName_ar ?? doc.documentName : doc.documentName}
          {doc.isUploaded && " ✓"}
        </Text>
      ))}
      <TouchableOpacity style={{ marginTop: 16, padding: 12, borderRadius: 6, borderWidth: 1, borderColor: "#d4d4d4" }}>
        <Text>{language === "ar" ? "اختر ملف" : "Choose file"}</Text>
      </TouchableOpacity>
    </View>
  );
};
