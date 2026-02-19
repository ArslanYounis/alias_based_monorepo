import type { AuditRemarksProps } from "@shared/types";
import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

export type { AuditRemarksProps };

export const AuditRemarks: React.FC<AuditRemarksProps> = ({
  title = "Audit Remarks",
  title_ar,
  theme = "dark",
  agent,
  applicationDetails = [],
  plots = [],
  owners = [],
  value,
  onChange,
  onOwnerClick,
  onPlotClick,
  language = "en",
}) => {
  return (
    <View style={{ padding: 16, backgroundColor: theme === "dark" ? "#262626" : "#f5f5f5", borderRadius: 8 }}>
      <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 16 }}>{language === "ar" ? title_ar ?? title : title}</Text>
      {agent && <Text style={{ marginBottom: 8 }}>{agent.name} · {agent.email}</Text>}
      {applicationDetails.map((app, i) => (
        <Text key={i} style={{ marginBottom: 4 }}>{app.applicationNumber} · {app.referenceNumber}</Text>
      ))}
      {plots.map((plot, i) => (
        <TouchableOpacity key={i} onPress={() => onPlotClick?.({ plot } as Parameters<NonNullable<AuditRemarksProps["onPlotClick"]>>[0])}>
          <Text style={{ marginBottom: 4 }}>{plot.code} · {plot.address}</Text>
        </TouchableOpacity>
      ))}
      {owners.map((owner, i) => (
        <TouchableOpacity key={i} onPress={() => onOwnerClick?.({ owner } as Parameters<NonNullable<AuditRemarksProps["onOwnerClick"]>>[0])}>
          <Text style={{ marginBottom: 4 }}>{owner.name}</Text>
        </TouchableOpacity>
      ))}
      <TextInput
        style={{ marginTop: 16, padding: 12, borderWidth: 1, borderColor: "#d4d4d4", borderRadius: 6, minHeight: 80, textAlignVertical: "top" }}
        placeholder={language === "ar" ? "ملاحظات" : "Remarks"}
        value={value ?? ""}
        onChangeText={(t) => onChange?.(t)}
        multiline
      />
    </View>
  );
};
