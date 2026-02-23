import React from "react";
import { Container } from "@platform/Container";
import { TextInput } from "@platform/TextInput";
import { RadioInput } from "@platform/RadioInput";
import type { CombinedPaymentForm } from "@shared/schemas";

export interface MeasurementStepProps {
  values: CombinedPaymentForm;
  onChange: (key: keyof CombinedPaymentForm, value: unknown) => void;
  language?: "en" | "ar";
}

export const MeasurementStep: React.FC<MeasurementStepProps> = ({
  values,
  onChange,
  language = "en",
}) => {
  return (
    <Container className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Container className="sm:col-span-2">
        <RadioInput
          label="Units of measurement"
          label_ar="وحدة القياس"
          options={[
            { label: "Square Feet", value: "Square Feet" },
            { label: "Square Meter", value: "Square Meter" },
          ]}
          value={values.units}
          onChange={(v) => onChange("units", v)}
          language={language}
        />
      </Container>
      <Container className="sm:col-span-2">
        <RadioInput
          label="Ranch type"
          label_ar="نوع المزرعة"
          options={[
            { label: "Temporary Ranch", label_ar: "مزرعة مؤقتة", value: "3" },
            { label: "Ranch With Service", label_ar: "مزرعة مع خدمة", value: "4" },
            { label: "Ranch Without Service", label_ar: "مزرعة بدون خدمة", value: "5" },
          ]}
          value={values.ranchType}
          onChange={(v) => onChange("ranchType", v)}
          language={language}
        />
      </Container>
      <TextInput
        fieldType="currency"
        label="Rent fees"
        label_ar="رسوم الإيجار"
        value={values.rentFees}
        onChange={(v) => onChange("rentFees", v)}
        language={language}
      />
      <TextInput
        fieldType="currency"
        label="Registration fees"
        label_ar="رسوم التسجيل"
        value={values.measurementRegistrationFees}
        onChange={(v) => onChange("measurementRegistrationFees", v)}
        language={language}
      />
      <TextInput
        label="Amount in words"
        label_ar="المبلغ بالحروف"
        value={values.measurementAmountInWords}
        onChange={(v) => onChange("measurementAmountInWords", v)}
        language={language}
      />
    </Container>
  );
};
