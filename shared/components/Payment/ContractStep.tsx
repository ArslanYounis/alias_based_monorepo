import React from "react";
import { Container } from "@platform/Container";
import { TextInput } from "@platform/TextInput";
import { RadioInput } from "@platform/RadioInput";
import type { CombinedPaymentForm } from "@shared/schemas";

export interface ContractStepProps {
  values: CombinedPaymentForm;
  onChange: (key: keyof CombinedPaymentForm, value: unknown) => void;
  language?: "en" | "ar";
}

export const ContractStep: React.FC<ContractStepProps> = ({
  values,
  onChange,
  language = "en",
}) => {
  return (
    <Container className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Container className="sm:col-span-2">
        <RadioInput
          label="Tenancy contract type"
          label_ar="نوع عقد الايجار"
          options={[
            { label: "New Tenancy", label_ar: "عقد إيجار جديد", value: "new" },
            { label: "Renew Tenancy", label_ar: "تجديد عقد الإيجار", value: "renew" },
          ]}
          value={values.tenancyContractType}
          onChange={(v) => onChange("tenancyContractType", v)}
          language={language}
        />
      </Container>
      <TextInput
        fieldType="date"
        label="Contract date"
        label_ar="تاريخ العقد"
        placeholder="01/07/2025"
        value={values.contractDate}
        onChange={(v) => onChange("contractDate", v)}
        language={language}
      />
      <TextInput
        label="Contract number"
        label_ar="رقم العقد"
        placeholder="0192393033"
        value={values.contractNumber}
        onChange={(v) => onChange("contractNumber", v)}
        language={language}
      />
      <TextInput
        fieldType="currency"
        label="Contract registration fees"
        label_ar="رسوم تسجيل العقد"
        placeholder="500"
        value={values.registrationFees}
        onChange={(v) => onChange("registrationFees", v)}
        language={language}
      />
      <TextInput
        label="Amount in words"
        label_ar="المبلغ بالحروف"
        placeholder="Five Hundred"
        value={values.amountInWords}
        onChange={(v) => onChange("amountInWords", v)}
        language={language}
      />
      <TextInput
        fieldType="date"
        label="Start date"
        label_ar="تاريخ البدء"
        placeholder="01/07/2025"
        value={values.startDate}
        onChange={(v) => onChange("startDate", v)}
        language={language}
      />
      <TextInput
        fieldType="date"
        label="End Date"
        label_ar="تاريخ الانتهاء"
        placeholder="01/07/2025"
        value={values.endDate}
        onChange={(v) => onChange("endDate", v)}
        language={language}
      />
      <TextInput
        fieldType="phone"
        label="Emergency Number"
        label_ar="رقم الطوارئ"
        placeholder="+971 50 123 4567"
        value={values.emergencyNumber}
        onChange={(v) => onChange("emergencyNumber", v)}
        language={language}
      />
    </Container>
  );
};
