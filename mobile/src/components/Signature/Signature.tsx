import type { SignatureProps } from "@shared/types";
import React, { useState } from "react";
import { View, Text } from "react-native";
import { Buttons } from "../../ui/Buttons";

export type { SignatureProps };

export const Signature: React.FC<SignatureProps> = ({
  title = "Sign to Approve",
  title_ar,
  theme = "dark",
  onSubmit,
  language = "en",
}) => {
  const [signed, setSigned] = useState(false);

  return (
    <View style={{ padding: 16, backgroundColor: theme === "dark" ? "#262626" : "#f5f5f5", borderRadius: 8 }}>
      <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 16 }}>
        {language === "ar" ? title_ar ?? title : title}
      </Text>
      <View style={{ height: 200, backgroundColor: "#fff", borderRadius: 8, borderWidth: 1, borderColor: "#d4d4d4", marginBottom: 16 }} />
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Buttons type="secondary" size="m" title={language === "ar" ? "مسح" : "Clear"} onClick={() => setSigned(false)} language={language} />
        <Buttons type="primary" size="m" title={language === "ar" ? "موافق" : "Approve"} onClick={() => onSubmit?.({ signature: "data:image/png;base64," } as Parameters<NonNullable<SignatureProps["onSubmit"]>>[0])} language={language} />
      </View>
    </View>
  );
};
