import type { SearchPlotProps } from "@shared/types";
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

export type { SearchPlotProps };

type TabKey = "plot" | "company" | "owner";

export const SearchPlot: React.FC<SearchPlotProps> = ({
  title = "Search Plot",
  title_ar,
  subtitle = "Choose a plot by type",
  subtitle_ar,
  ownerTypeOptions = {},
  initialOwnerType = "plot",
  enabledTabs = { plot: true, company: true, owner: true },
  onSubmit,
  language = "en",
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>(initialOwnerType);
  const plotLabel = language === "ar" ? ownerTypeOptions.plot_ar ?? ownerTypeOptions.plot ?? "By Plot" : ownerTypeOptions.plot ?? "By Plot";
  const companyLabel = language === "ar" ? ownerTypeOptions.company_ar ?? ownerTypeOptions.company ?? "By Company Owner" : ownerTypeOptions.company ?? "By Company Owner";
  const ownerLabel = language === "ar" ? ownerTypeOptions.owner_ar ?? ownerTypeOptions.owner ?? "By Owner" : ownerTypeOptions.owner ?? "By Owner";

  return (
    <View style={{ padding: 16, borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 8 }}>
      <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 8 }}>{language === "ar" ? title_ar ?? title : title}</Text>
      <Text style={{ marginBottom: 16 }}>{language === "ar" ? subtitle_ar ?? subtitle : subtitle}</Text>
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 16, borderBottomWidth: 1, borderBottomColor: "#e5e7eb" }}>
        {enabledTabs.plot !== false && <TouchableOpacity onPress={() => setActiveTab("plot")} style={{ paddingVertical: 8, paddingHorizontal: 16, borderBottomWidth: activeTab === "plot" ? 2 : 0, borderBottomColor: "#0d9488" }}><Text>{plotLabel}</Text></TouchableOpacity>}
        {enabledTabs.company !== false && <TouchableOpacity onPress={() => setActiveTab("company")} style={{ paddingVertical: 8, paddingHorizontal: 16, borderBottomWidth: activeTab === "company" ? 2 : 0, borderBottomColor: "#0d9488" }}><Text>{companyLabel}</Text></TouchableOpacity>}
        {enabledTabs.owner !== false && <TouchableOpacity onPress={() => setActiveTab("owner")} style={{ paddingVertical: 8, paddingHorizontal: 16, borderBottomWidth: activeTab === "owner" ? 2 : 0, borderBottomColor: "#0d9488" }}><Text>{ownerLabel}</Text></TouchableOpacity>}
      </View>
      <TouchableOpacity onPress={() => onSubmit?.({ activeTab } as Parameters<NonNullable<SearchPlotProps["onSubmit"]>>[0])} style={{ padding: 12, borderRadius: 6, backgroundColor: "#0d9488" }}>
        <Text style={{ color: "#fff" }}>{language === "ar" ? "بحث" : "Search"}</Text>
      </TouchableOpacity>
    </View>
  );
};
