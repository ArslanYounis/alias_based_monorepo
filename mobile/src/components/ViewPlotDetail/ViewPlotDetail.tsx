import type { ViewPlotDetailProps } from "@shared/types";
import React from "react";
import { View, Text } from "react-native";

export type { ViewPlotDetailProps };

export const ViewPlotDetail: React.FC<ViewPlotDetailProps> = ({
  plotTitle = "Plot Title",
  plotTitle_ar,
  plotIds = [],
  ownerText = "Owner",
  ownerText_ar,
  showOwnerDetails = true,
  language = "en",
}) => {
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 16 }}>{language === "ar" ? plotTitle_ar ?? plotTitle : plotTitle}</Text>
      {plotIds.length > 0 && <Text style={{ marginBottom: 8 }}>IDs: {plotIds.join(", ")}</Text>}
      {showOwnerDetails && <Text>{language === "ar" ? ownerText_ar ?? ownerText : ownerText}</Text>}
    </View>
  );
};
