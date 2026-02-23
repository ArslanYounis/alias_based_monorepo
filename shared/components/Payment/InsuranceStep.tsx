import React from "react";
import { Container } from "@platform/Container";
import { TextInput } from "@platform/TextInput";
import { RadioInput } from "@platform/RadioInput";
import type { CombinedPaymentForm } from "@shared/schemas";

export interface InsuranceStepProps {
  values: CombinedPaymentForm;
  onChange: (key: keyof CombinedPaymentForm, value: unknown) => void;
  language?: "en" | "ar";
}

export const InsuranceStep: React.FC<InsuranceStepProps> = ({
  values,
  onChange,
  language = "en",
}) => {
  return (
    <Container className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Container className="sm:col-span-2">
        <RadioInput
          label="Insurance fee"
          label_ar="رسوم التأمين"
          options={[
            { label: "Yes", label_ar: "نعم", value: "Yes" },
            { label: "No", label_ar: "لا", value: "No" },
          ]}
          value={values.insuranceFee}
          onChange={(v) => onChange("insuranceFee", v)}
          language={language}
        />
      </Container>
      {values.insuranceFee === "Yes" && (
        <>
          <TextInput
            fieldType="currency"
            label="Insurance registration fees"
            label_ar="رسوم تسجيل التأمين"
            value={values.insuranceRegistrationFees}
            onChange={(v) => onChange("insuranceRegistrationFees", v)}
            language={language}
          />
          <TextInput
            label="Amount in words"
            label_ar="المبلغ بالحروف"
            value={values.insuranceAmountInWords}
            onChange={(v) => onChange("insuranceAmountInWords", v)}
            language={language}
          />
        </>
      )}
    </Container>
  );
};
