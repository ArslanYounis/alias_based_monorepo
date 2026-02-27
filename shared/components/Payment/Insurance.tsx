import { z } from "zod";
import React, { useState } from "react";
import { TextInput } from "@platform/TextInput";
import { Label } from "@platform/Label";
import { RadioField } from "@platform/RadioField";
import { Container } from "@platform/Container";
import type { SimpleForm } from "./types";
import { InsuranceSchema } from "./helper";

export type InsuranceValues = z.infer<typeof InsuranceSchema>;
export type StepErrorMap = Record<keyof InsuranceValues, string>;

export interface InsuranceProps {
  language?: "en" | "ar";
  form: SimpleForm<InsuranceValues>;
  externalErrors?: Partial<StepErrorMap>;
  onLiveValidate?: () => void;
}

const Insurance: React.FC<InsuranceProps> = ({
  language,
  form,
  onLiveValidate,
}) => {
  const [insuranceFee, setInsuranceFee] = useState("Yes");

  return (
    <Container className="grid !grid-cols-1 sm:!grid-cols-2 gap-l">
      <Container className="space-t-m sm:col-span-2">
        <form.Field
          name={"insuranceFee"}
          children={(field) => {
            return (
              <Container className="flex flex-col">
                <Container className="mb-s">
                  <Label
                    label="Insurance fee"
                    label_ar="رسوم التأمين"
                    required
                    tooltipText="Select whether insurance fees apply"
                    tooltipText_ar="اختر ما إذا كانت رسوم التأمين مطبقة"
                    language={language}
                    showInfoIcon
                  />
                </Container>

                <Container className="flex gap-l">
                  {(["Yes", "No"] as const).map((type) => {
                    const id = `insurance-${type}`;
                    return (
                      <RadioField
                        key={id}
                        id={id}
                        value={type}
                        checked={field.state.value === type}
                        onChange={() => {
                          setInsuranceFee(type);
                          field.handleChange(type);
                          onLiveValidate?.();
                        }}
                        label={type === "Yes" ? "Yes" : "No"}
                        label_ar={type === "Yes" ? "نعم" : "لا"}
                        language={language}
                      />
                    );
                  })}
                </Container>
              </Container>
            );
          }}
        />
      </Container>

      {insuranceFee === "Yes" && (
        <>
          <form.Field
            name={"insuranceRegistrationFees"}
            children={(field) => {
              return (
                <TextInput
                  fieldType="currency"
                  label="Rent fees area per unit (in fils)"
                  label_ar="قيمة الإيجار لوحدة المساحة (بالفلس)"
                  placeholder="500"
                  placeholder_ar="٥٠٠"
                  value={field.state.value}
                  onChange={(val: string) => {
                    field.handleChange(val);
                    onLiveValidate?.();
                  }}
                  language={language}
                  required
                  disabled
                />
              );
            }}
          />

          <form.Field
            name={"insuranceAmountInWords"}
            children={(field) => {
              return (
                <TextInput
                  label="Amount in words"
                  label_ar="المبلغ بالحروف"
                  placeholder="Five Hundred"
                  placeholder_ar="خمسمائة"
                  value={field.state.value}
                  onChange={(val: string) => {
                    field.handleChange(val);
                    onLiveValidate?.();
                  }}
                  language={language}
                  required
                  disabled
                />
              );
            }}
          />
        </>
      )}
    </Container>
  );
};

export default Insurance;
