import type { PaymentDetailsProps } from "@shared/types";
import React from "react";
import { View, Text } from "react-native";
import { Buttons } from "../../ui/Buttons";

export type { PaymentDetailsProps };

export const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  applicationId,
  payments = [],
  showButtons = false,
  buttons = [],
  isLoading = false,
  paymentOverrideTitle,
  paymentOverrideTitle_ar,
  onOverrideComplete,
  language = "en",
}) => {
  if (isLoading) {
    return <Text style={{ padding: 32, textAlign: "center" }}>{language === "ar" ? "جاري التحميل..." : "Loading..."}</Text>;
  }

  return (
    <View style={{ padding: 16, borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 8 }}>
      {applicationId && <Text style={{ marginBottom: 16 }}>{language === "ar" ? "رقم الطلب" : "Application ID"}: {applicationId}</Text>}
      {payments.map((p, i) => (
        <View key={p.applicationPaymentId ?? i} style={{ padding: 12, marginBottom: 8, backgroundColor: "#f9fafb", borderRadius: 6 }}>
          <Text style={{ fontWeight: "500" }}>{language === "ar" ? p.paymentDescriptionA ?? p.paymentDescriptionE : p.paymentDescriptionE}</Text>
          <Text style={{ fontSize: 12, color: "#6b7280" }}>{p.amountDue} · {p.municipalityNameE}</Text>
        </View>
      ))}
      {paymentOverrideTitle && (
        <Buttons type="primary" size="m" title={language === "ar" ? paymentOverrideTitle_ar ?? paymentOverrideTitle : paymentOverrideTitle} onClick={() => onOverrideComplete?.({} as Parameters<NonNullable<PaymentDetailsProps["onOverrideComplete"]>>[0])} language={language} />
      )}
      {showButtons && buttons.length > 0 && (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
          {buttons.map((btn, i) => (
            <Buttons key={i} type={btn.type} size="m" title={language === "ar" ? btn.title_ar ?? btn.title : btn.title} onClick={btn.onClick} disabled={btn.disabled} language={language} />
          ))}
        </View>
      )}
    </View>
  );
};
