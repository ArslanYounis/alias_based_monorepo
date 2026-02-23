import React from "react";
import { Container } from "@platform/Container";
import { TextInput } from "@platform/TextInput";
import { RadioInput } from "@platform/RadioInput";
import { CheckboxField } from "@platform/CheckboxField";
import type { CombinedPaymentForm } from "@shared/schemas";

export interface RentStepProps {
  values: CombinedPaymentForm;
  onChange: (key: keyof CombinedPaymentForm, value: unknown) => void;
  language?: "en" | "ar";
}

export const RentStep: React.FC<RentStepProps> = ({
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
      <TextInput
        fieldType="date"
        label="Rent payment start date"
        label_ar="تاريخ بدء سداد الإيجار"
        placeholder="01/07/2025"
        value={values.rentPaymentStartDate}
        onChange={(v) => onChange("rentPaymentStartDate", v)}
        language={language}
      />
      <TextInput
        fieldType="date"
        label="Rent payment end date"
        label_ar="تاريخ انتهاء سداد الإيجار"
        placeholder="01/07/2025"
        value={values.rentPaymentEndDate}
        onChange={(v) => onChange("rentPaymentEndDate", v)}
        language={language}
      />
      <TextInput
        fieldType="currency"
        label="Payment amount"
        label_ar="مبلغ الدفع"
        value={values.paymentAmount}
        onChange={(v) => onChange("paymentAmount", v)}
        language={language}
      />
      <Container className="sm:col-span-2">
        <CheckboxField
          label="Rent payment is free for the year"
          label_ar="دفع الإيجار مجاني للسنة"
          checked={values.isFirstYearFreeOfPayment ?? false}
          onChange={(checked) => onChange("isFirstYearFreeOfPayment", checked)}
          language={language}
        />
      </Container>
      <Container className="sm:col-span-2">
        <CheckboxField
          label="Exempt social assistance recipient"
          label_ar="إعفاء مستحقي المساعدات الاجتماعية"
          checked={values.exemptSocialAssistance ?? false}
          onChange={(checked) => onChange("exemptSocialAssistance", checked)}
          language={language}
        />
      </Container>
    </Container>
  );
};
