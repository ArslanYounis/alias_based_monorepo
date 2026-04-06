import { z } from "zod";
import React from "react";
import { TextInput } from "@platform/TextInput";
import { Label } from "@platform/Label";
import { RadioField } from "@platform/RadioField";
import { CheckboxField } from "@platform/CheckboxField";
import { Container } from "@platform/Container";
import { CalendarIcon } from "@platform/icons";
import type { SimpleForm } from "./types";
import { RentSchema } from "./helper";

export type RentValues = z.infer<typeof RentSchema>;
export type StepErrorMap = Record<keyof RentValues, string>;

export interface RentProps {
  language?: "en" | "ar";
  form: SimpleForm<RentValues>;
  externalErrors?: Partial<StepErrorMap>;
  onLiveValidate?: () => void;
}

const Rent: React.FC<RentProps> = ({ language, form, onLiveValidate }) => {
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
                        checked={field.state.value === type ? id : undefined}
                        onChange={() => {
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

      <form.Field
        name={"rentPaymentStartDate"}
        children={(field) => {
          return (
            <TextInput
              fieldType="date"
              label="Rent payment start date"
              label_ar="تاريخ بدء سداد الإيجار"
              placeholder="01/07/2025"
              placeholder_ar="٠١/٠٧/٢٠٢٥"
              value={field.state.value}
              onChange={(val: string) => {
                field.handleChange(val);
                onLiveValidate?.();
              }}
              language={language}
              icon={<CalendarIcon />}
              required
              disabled
            />
          );
        }}
      />

      <form.Field
        name={"rentPaymentEndDate"}
        children={(field) => {
          return (
            <TextInput
              fieldType="date"
              label="Rent payment end date"
              label_ar="تاريخ انتهاء سداد الإيجار"
              placeholder="01/07/2025"
              placeholder_ar="٠١/٠٧/٢٠٢٥"
              value={field.state.value}
              onChange={(val: string) => {
                field.handleChange(val);
                onLiveValidate?.();
              }}
              language={language}
              icon={<CalendarIcon />}
              required
              disabled
            />
          );
        }}
      />

      <form.Field
        name={"paymentAmount"}
        children={(field) => {
          return (
            <TextInput
              fieldType="currency"
              label="Payment amount"
              label_ar="قيمة الدفع"
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

      <Container className="space-y-m sm:col-span-2">
        <form.Field
          name={"isFirstYearFreeOfPayment"}
          children={(field) => (
            <CheckboxField
              id="is-first-year-free-of-payment"
              checked={Boolean(field.state.value)}
              onChange={() => {
                field.handleChange(!field.state.value);
                onLiveValidate?.();
              }}
              label="Rent payment is free for the year"
              label_ar="دفع الإيجار مجاني للسنة"
              language={language}
            />
          )}
        />
      </Container>

      <Container className="space-y-m sm:col-span-2">
        <form.Field
          name={"exemptSocialAssistance"}
          children={(field) => (
            <CheckboxField
              id="exempt-social-assistance"
              checked={Boolean(field.state.value)}
              onChange={() => {
                field.handleChange(!field.state.value);
                onLiveValidate?.();
              }}
              label="Exempt social assistance recipient"
              label_ar="إعفاء مستحقي المساعدات الاجتماعية"
              language={language}
            />
          )}
        />
      </Container>
    </Container>
  );
};

export default Rent;
