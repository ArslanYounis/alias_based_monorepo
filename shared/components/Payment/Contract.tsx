import { z } from "zod";
import React from "react";
import { TextInput } from "@platform/TextInput";
import { Label } from "@platform/Label";
import { RadioField } from "@platform/RadioField";
import { Container } from "@platform/Container";
import { CalendarIcon } from "@platform/icons";
import type { SimpleForm } from "./types";
import { ContractSchema } from "./helper";

export type ContractValues = z.infer<typeof ContractSchema>;
export type StepErrorMap = Record<keyof ContractValues, string>;

export interface ContractProps {
  language?: "en" | "ar";
  form: SimpleForm<ContractValues>;
  externalErrors?: Partial<StepErrorMap>;
  onLiveValidate?: () => void;
}

const Contract: React.FC<ContractProps> = ({
  language,
  form,
  onLiveValidate,
}) => {
  return (
    <Container className="grid !grid-cols-1 sm:!grid-cols-2 gap-l">
      <Container className="pt-m sm:col-span-2">
        <form.Field
          name={"tenancyContractType"}
          children={(field) => (
            <Container>
              <Container className="mb-s">
                <Label
                  label="Tenancy contract type"
                  label_ar="نوع عقد الايجار"
                  required
                  tooltipText="Choose whether it is a new or renewed tenancy"
                  tooltipText_ar="اختر ما إذا كان عقد إيجار جديد أو متجدد"
                  language={language}
                  showInfoIcon
                />
              </Container>

              <Container className="flex gap-l">
                {(["new", "renew"] as const).map((type) => {
                  const id = `tenancy-${type}`;
                  return (
                    <RadioField
                      key={id}
                      id={id}
                      checked={field.state.value === type ? id : undefined}
                      label={type === "new" ? "New Tenancy" : "Renew Tenancy"}
                      label_ar={
                        type === "new" ? "عقد إيجار جديد" : "تجديد عقد الإيجار"
                      }
                      language={language}
                      disabled
                    />
                  );
                })}
              </Container>
            </Container>
          )}
        />
      </Container>

      <form.Field
        name={"contractDate"}
        children={(field) => {
          return (
            <TextInput
              fieldType="date"
              label="Contract date"
              label_ar="تاريخ العقد"
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
        name={"contractNumber"}
        children={(field) => {
          return (
            <TextInput
              label="Contract number"
              label_ar="رقم العقد"
              placeholder="0192393033"
              placeholder_ar="0192393033"
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
        name={"registrationFees"}
        children={(field) => {
          return (
            <TextInput
              fieldType="currency"
              label="Contract registration fees"
              label_ar="رسوم تسجيل العقد"
              placeholder="500"
              placeholder_ar=""
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
        name={"amountInWords"}
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

      <form.Field
        name={"startDate"}
        children={(field) => {
          return (
            <TextInput
              fieldType="date"
              label="Start date"
              label_ar="تاريخ البدء"
              placeholder="01/07/2025"
              placeholder_ar="٠١/٠٧/٢٠٢٥"
              value={field.state.value}
              onChange={(val: string) => {
                field.handleChange(val);
                onLiveValidate?.();
              }}
              language={language}
              required
              disabled
              icon={<CalendarIcon />}
            />
          );
        }}
      />

      <form.Field
        name={"endDate"}
        children={(field) => {
          return (
            <TextInput
              fieldType="date"
              label="End Date"
              label_ar="تاريخ الانتهاء"
              placeholder="01/07/2025"
              placeholder_ar="٠١/٠٧/٢٠٢٥"
              value={field.state.value}
              onChange={(val: string) => {
                field.handleChange(val);
                onLiveValidate?.();
              }}
              language={language}
              required
              disabled
              icon={<CalendarIcon />}
            />
          );
        }}
      />

      <form.Field
        name={"emergencyNumber"}
        children={(field) => {
          return (
            <TextInput
              fieldType="phone"
              label="Emergency Number"
              label_ar="رقم الطوارئ"
              placeholder="+971 50 123 4567"
              placeholder_ar="+٩٧١ ٥٠ ١٢٣ ٤٥٦٧"
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

    </Container>
  );
};

export default Contract;
