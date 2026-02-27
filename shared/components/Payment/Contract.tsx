import { z } from "zod";
import React from "react";
import { TextInput } from "@platform/TextInput";
import { Label } from "@platform/Label";
import { RadioField } from "@platform/RadioField";
import { Container } from "@platform/Container";
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

const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.25 10.75H3.75V19C3.75 19.6904 4.30964 20.25 5 20.25H19C19.6904 20.25 20.25 19.6904 20.25 19V10.75ZM14.25 6V4.75H10.5C10.0858 4.75 9.75 4.41421 9.75 4C9.75 3.58579 10.0858 3.25 10.5 3.25H14.25V2C14.25 1.58579 14.5858 1.25 15 1.25C15.4142 1.25 15.75 1.58579 15.75 2V6C15.75 6.41421 15.4142 6.75 15 6.75C14.5858 6.75 14.25 6.41421 14.25 6ZM21.75 19C21.75 20.5188 20.5188 21.75 19 21.75H5C3.48122 21.75 2.25 20.5188 2.25 19V10C2.25 9.58579 2.58579 9.25 3 9.25H21C21.4142 9.25 21.75 9.58579 21.75 10V19Z" fill="currentColor" />
    <path d="M2.25 10V6C2.25 4.48122 3.48122 3.25 5 3.25H7C7.41421 3.25 7.75 3.58579 7.75 4C7.75 4.41421 7.41421 4.75 7 4.75H5C4.30964 4.75 3.75 5.30964 3.75 6V10C3.75 10.4142 3.41421 10.75 3 10.75C2.58579 10.75 2.25 10.4142 2.25 10Z" fill="currentColor" />
    <path d="M6.25 6V2C6.25 1.58579 6.58579 1.25 7 1.25C7.41421 1.25 7.75 1.58579 7.75 2V6C7.75 6.41421 7.41421 6.75 7 6.75C6.58579 6.75 6.25 6.41421 6.25 6Z" fill="currentColor" />
    <path d="M20.25 10V6C20.25 5.30964 19.6904 4.75 19 4.75H18.5C18.0858 4.75 17.75 4.41421 17.75 4C17.75 3.58579 18.0858 3.25 18.5 3.25H19C20.5188 3.25 21.75 4.48122 21.75 6V10C21.75 10.4142 21.4142 10.75 21 10.75C20.5858 10.75 20.25 10.4142 20.25 10Z" fill="currentColor" />
  </svg>
);

const Contract: React.FC<ContractProps> = ({
  language,
  form,
  onLiveValidate,
}) => {
  return (
    <Container className="grid !grid-cols-1 sm:!grid-cols-2 gap-l">
      <Container className="space-t-m sm:col-span-2">
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
                      checked={field.state.value === type}
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
