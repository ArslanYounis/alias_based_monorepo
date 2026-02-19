import type { NewApplicationSummaryProps } from "@shared/types";
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

export type { NewApplicationSummaryProps };

export const NewApplicationSummary: React.FC<NewApplicationSummaryProps> = ({
  title = "Application Summary",
  title_ar,
  applicationId,
  onPressPlotView,
  onPressOwnerAction,
  language = "en",
}) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <View style={{ borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 8, overflow: "hidden" }}>
      <TouchableOpacity onPress={() => setExpanded((e) => !e)} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, backgroundColor: "#f9fafb" }}>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>{language === "ar" ? title_ar ?? title : title}</Text>
        <Text>{expanded ? "▼" : "▶"}</Text>
      </TouchableOpacity>
      {expanded && (
        <View style={{ padding: 16 }}>
          {applicationId && <Text style={{ marginBottom: 16 }}>ID: {applicationId}</Text>}
          <TouchableOpacity onPress={() => onPressPlotView?.()}><Text style={{ color: "#0d9488" }}>{language === "ar" ? "عرض القطعة" : "View plot"}</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onPressOwnerAction?.("edit", {})} style={{ marginTop: 8 }}><Text style={{ color: "#0d9488" }}>{language === "ar" ? "إجراء المالك" : "Owner action"}</Text></TouchableOpacity>
        </View>
      )}
    </View>
  );
};
