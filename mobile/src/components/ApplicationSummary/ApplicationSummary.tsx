import type { ApplicationSummaryProps } from "@shared/types";
import React from "react";
import { View, Text } from "react-native";

export type { ApplicationSummaryProps };

export const ApplicationSummary: React.FC<ApplicationSummaryProps> = ({
  title = "Application Summary",
  title_ar,
  data = [],
  language = "en",
}) => {
  const flat = Array.isArray(data) ? data.flat() : [];

  return (
    <View style={{ borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 8, overflow: "hidden" }}>
      <Text style={{ padding: 16, fontSize: 18, fontWeight: "700", backgroundColor: "#f9fafb" }}>{language === "ar" ? title_ar ?? title : title}</Text>
      <View style={{ padding: 16, gap: 16 }}>
        {flat.map((section: unknown, i: number) => (
          <View key={i} style={{ padding: 12, borderRadius: 6, backgroundColor: "#f9fafb" }}>
            <Text style={{ fontSize: 14 }}>{typeof section === "object" && section !== null && "type" in section ? String((section as { type?: string }).type) : "—"}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};
