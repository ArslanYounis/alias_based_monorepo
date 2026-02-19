import type { PaymentProps } from "@shared/types";
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Buttons } from "../../ui/Buttons";

export type { PaymentProps };

export const Payment: React.FC<PaymentProps> = ({
  applicationId,
  isStepInfoPending = false,
  isPaymentSubmitting = false,
  onSubmit,
  onSuccess,
  onSaveDraft,
  language = "en",
}) => {
  const [step, setStep] = useState(1);

  if (isStepInfoPending) {
    return <Text style={{ padding: 32, textAlign: "center" }}>{language === "ar" ? "جاري التحميل..." : "Loading..."}</Text>;
  }

  return (
    <View style={{ padding: 16, borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 8 }}>
      {applicationId && <Text style={{ marginBottom: 16 }}>{language === "ar" ? "رقم الطلب" : "Application ID"}: {applicationId}</Text>}
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
        <TouchableOpacity onPress={() => setStep(1)} style={{ padding: 8, borderRadius: 6, backgroundColor: step === 1 ? "#0d9488" : "#e5e7eb" }}><Text style={{ color: step === 1 ? "#fff" : "#374151" }}>1</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setStep(2)} style={{ padding: 8, borderRadius: 6, backgroundColor: step === 2 ? "#0d9488" : "#e5e7eb" }}><Text style={{ color: step === 2 ? "#fff" : "#374151" }}>2</Text></TouchableOpacity>
      </View>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Buttons type="secondary" size="m" title={language === "ar" ? "مسودة" : "Save draft"} onClick={() => onSaveDraft?.({} as Parameters<NonNullable<PaymentProps["onSaveDraft"]>>[0])} language={language} />
        <Buttons type="primary" size="m" title={language === "ar" ? "إرسال" : "Submit"} disabled={isPaymentSubmitting} onClick={() => { onSubmit?.({} as Parameters<NonNullable<PaymentProps["onSubmit"]>>[0]); onSuccess?.({} as Parameters<NonNullable<PaymentProps["onSuccess"]>>[0]); }} language={language} />
      </View>
    </View>
  );
};
