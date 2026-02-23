import type { ViewPlotDetailProps } from "@shared/types";
import { useViewPlotDetail } from "@shared/hooks";
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
  const singleId = plotIds?.length === 1 ? plotIds[0] : undefined;
  const { data: plotDetail, isPending } = useViewPlotDetail(singleId);
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 16 }}>{language === "ar" ? plotTitle_ar ?? plotTitle : plotTitle}</Text>
      {isPending && <Text style={{ marginBottom: 8 }}>{language === "ar" ? "جاري التحميل..." : "Loading..."}</Text>}
      {plotDetail?.plotNumber != null && <Text style={{ marginBottom: 8 }}>{language === "ar" ? "رقم القطعة" : "Plot"}: {plotDetail.plotNumber}</Text>}
      {plotIds?.length > 0 && <Text style={{ marginBottom: 8 }}>IDs: {plotIds.join(", ")}</Text>}
      {showOwnerDetails && <Text>{language === "ar" ? ownerText_ar ?? ownerText : ownerText}</Text>}
    </View>
  );
};
