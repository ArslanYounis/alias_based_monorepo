import type { PaymentProps } from "@shared/types";
import { usePayment } from "@shared/hooks";
import { getPaymentDefaultValues, PAYMENT_STEP_COUNT, type PaymentStepId } from "@shared/forms";
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Buttons } from "../../ui/Buttons";

export type { PaymentProps };

export const Payment: React.FC<PaymentProps> = ({
  applicationId,
  stepInfo: stepInfoProp,
  isStepInfoPending: isStepInfoPendingProp = false,
  isPaymentSubmitting = false,
  onSubmit,
  onSuccess,
  onSaveDraft,
  language = "en",
}) => {
  const [step, setStep] = useState<PaymentStepId>(0);
  const { data: stepInfoFromHook, isPending: isStepInfoPendingFromHook } = usePayment(applicationId);
  const stepInfo = stepInfoProp ?? stepInfoFromHook;
  const isStepInfoPending = isStepInfoPendingProp || (!!applicationId && isStepInfoPendingFromHook);
  const _defaultValues = getPaymentDefaultValues();

  if (isStepInfoPending) {
    return <Text style={{ padding: 32, textAlign: "center" }}>{language === "ar" ? "جاري التحميل..." : "Loading..."}</Text>;
  }

  return (
    <View style={{ padding: 16, borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 8 }}>
      {applicationId && <Text style={{ marginBottom: 16 }}>{language === "ar" ? "رقم الطلب" : "Application ID"}: {applicationId}</Text>}
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
        {Array.from({ length: PAYMENT_STEP_COUNT }, (_, i) => i as PaymentStepId).map((s) => (
          <TouchableOpacity key={s} onPress={() => setStep(s)} style={{ padding: 8, borderRadius: 6, backgroundColor: step === s ? "#0d9488" : "#e5e7eb" }}><Text style={{ color: step === s ? "#fff" : "#374151" }}>{s + 1}</Text></TouchableOpacity>
        ))}
      </View>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Buttons type="secondary" size="m" title={language === "ar" ? "مسودة" : "Save draft"} onClick={() => onSaveDraft?.({} as Parameters<NonNullable<PaymentProps["onSaveDraft"]>>[0])} language={language} />
        <Buttons type="primary" size="m" title={language === "ar" ? "إرسال" : "Submit"} disabled={isPaymentSubmitting} onClick={() => { onSubmit?.({} as Parameters<NonNullable<PaymentProps["onSubmit"]>>[0]); onSuccess?.({} as Parameters<NonNullable<PaymentProps["onSuccess"]>>[0]); }} language={language} />
      </View>
    </View>
  );
};
