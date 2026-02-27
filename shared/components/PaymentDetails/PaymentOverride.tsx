import React, { useMemo, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Container } from "@platform/Container";
import { Text } from "@platform/Text";
import { Buttons } from "@platform/Buttons";
import { TextInput } from "@platform/TextInput";
import { CheckboxField } from "@platform/CheckboxField";
import SharedLanguageSwitchRenderer from "../SharedLanguageSwitchRenderer";

export type PaymentOverrideValues = {
  referenceNumber: string;
  receiptDate: string;
  amount: string;
  ignoreDuplicate: boolean;
};

interface Labels {
  serviceName: string;
  serviceName_ar?: string;
  applicationNumber: string;
  applicationNumber_ar?: string;
  paymentFee: string;
  paymentFee_ar?: string;
  referenceNumber: string;
  referenceNumber_ar?: string;
  receiptDate: string;
  receiptDate_ar?: string;
  amount: string;
  amount_ar?: string;
  rentPaymentsFree: string;
  rentPaymentsFree_ar?: string;
}

interface PaymentOverrideProps {
  title: string;
  title_ar?: string;
  description: string;
  description_ar?: string;
  ServiceName: string;
  ServiceName_ar?: string;
  applicationNo: string;
  applicationNo_ar?: string;
  PaymentFee: string;
  PaymentFee_ar?: string;
  theme?: "light" | "dark";
  language?: "en" | "ar";
  labels?: Labels;
  isLoading?: boolean;
  onSubmit?: (values: PaymentOverrideValues) => void;
}

const defaultLabels: Labels = {
  serviceName: "Service Name",
  serviceName_ar: "اسم الخدمة",
  applicationNumber: "Application Number",
  applicationNumber_ar: "رقم الطلب",
  paymentFee: "Payment Fee",
  paymentFee_ar: "رسوم الدفع",
  referenceNumber: "Reference Number",
  referenceNumber_ar: "الرقم المرجعي",
  receiptDate: "Receipt Date",
  receiptDate_ar: "تاريخ الإيصال",
  amount: "Amount",
  amount_ar: "المبلغ",
  rentPaymentsFree: "Ignore duplicate receipt number",
  rentPaymentsFree_ar: "تجاهل رقم الإيصال المكرر",
};

const buildSchema = (paymentFee: number | null, language: "en" | "ar" = "en") =>
  z.object({
    referenceNumber: z
      .string()
      .min(
        1,
        language === "ar"
          ? "حقل رقم المرجع مطلوب"
          : "Reference number is required"
      ),
    receiptDate: z
      .string()
      .min(
        1,
        language === "ar"
          ? "حقل تاريخ الإيصال مطلوب"
          : "Receipt date is required"
      ),
    amount: z
      .string()
      .min(1, language === "ar" ? "حقل المبلغ مطلوب" : "Amount is required")
      .refine(
        (s) => !Number.isNaN(Number(s)),
        language === "ar"
          ? "يجب أن يكون المبلغ رقمًا"
          : "Amount must be a number"
      )
      .refine(
        (s) => {
          if (paymentFee === null) return true;
          const v = Number(s);
          return v >= paymentFee;
        },
        paymentFee !== null
          ? language === "ar"
            ? `يجب أن يكون المبلغ أكبر من أو يساوي ${paymentFee}`
            : `Amount must be greater than or equal to ${paymentFee}`
          : language === "ar"
          ? "مبلغ غير صالح"
          : "Invalid amount"
      ),
    ignoreDuplicate: z.boolean(),
  });

const PaymentOverride: React.FC<PaymentOverrideProps> = ({
  title,
  title_ar,
  description,
  description_ar,
  ServiceName,
  ServiceName_ar,
  applicationNo,
  applicationNo_ar,
  PaymentFee,
  PaymentFee_ar,
  language = "en",
  labels = defaultLabels,
  onSubmit,
  isLoading,
}) => {
  const isRTL = language === "ar";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const paymentFeeNumber = useMemo(() => {
    const n = Number(PaymentFee);
    return Number.isFinite(n) ? n : null;
  }, [PaymentFee]);

  const form = useForm({
    defaultValues: {
      referenceNumber: "",
      receiptDate: "",
      amount: "",
      ignoreDuplicate: true,
    },
    onSubmit: async ({ value }) => {
      const schema = buildSchema(paymentFeeNumber, language);
      const result = schema.safeParse(value);
      if (result.success) {
        onSubmit?.(value);
      } else {
        const errs = result.error.issues.reduce<Record<string, string>>(
          (acc, issue) => {
            if (issue.path && issue.path.length > 0) {
              acc[String(issue.path[0])] = issue.message;
            }
            return acc;
          },
          {}
        );
        setErrors(errs);
      }
    },
  });

  const validateField = (
    fieldName: keyof PaymentOverrideValues,
    value: unknown
  ) => {
    const current = {
      ...form.state.values,
      [fieldName]: value,
    } as PaymentOverrideValues;
    const schema = buildSchema(paymentFeeNumber, language);
    const result = schema.safeParse(current);
    if (result.success) {
      setErrors((prev) => {
        if (!prev[fieldName]) return prev;
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    } else {
      const issueForField = result.error.issues.find(
        (iss) =>
          iss.path &&
          iss.path.length > 0 &&
          String(iss.path[0]) === String(fieldName)
      );
      if (issueForField) {
        setErrors((prev) => ({
          ...prev,
          [String(fieldName)]: issueForField.message,
        }));
      } else {
        setErrors((prev) => {
          if (!prev[fieldName]) return prev;
          const next = { ...prev };
          delete next[fieldName];
          return next;
        });
      }
    }
  };

  const handleFormSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await form.handleSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className={isRTL ? "rtl" : "ltr"}>
      <Text className="text-heading-h1 font-bold mb-s text-text-default">
        <SharedLanguageSwitchRenderer
          value={title}
          value_ar={title_ar}
          language={language}
        />
      </Text>

      <Text className="text-m text-text-default py-m">
        <SharedLanguageSwitchRenderer
          value={description}
          value_ar={description_ar}
          language={language}
        />
      </Text>

      <Container className="flex items-center mb-xl">
        <Container className="w-1/2 flex flex-col gap-3">
          <Text className="text-bold-m text-text-default">
            <SharedLanguageSwitchRenderer
              value={labels.serviceName}
              value_ar={labels.serviceName_ar}
              language={language}
            />
          </Text>
          <Text className="text-bold-m text-text-default">
            <SharedLanguageSwitchRenderer
              value={labels.applicationNumber}
              value_ar={labels.applicationNumber_ar}
              language={language}
            />
          </Text>
          <Text className="text-bold-m text-text-default">
            <SharedLanguageSwitchRenderer
              value={labels.paymentFee}
              value_ar={labels.paymentFee_ar}
              language={language}
            />
          </Text>
        </Container>

        <Container className="w-1/2 flex flex-col gap-3">
          <Text className="text-text-default text-m">
            <SharedLanguageSwitchRenderer
              value={ServiceName}
              value_ar={ServiceName_ar}
              language={language}
            />
          </Text>
          <Text className="text-text-default text-m">
            <SharedLanguageSwitchRenderer
              value={applicationNo}
              value_ar={applicationNo_ar}
              language={language}
            />
          </Text>
          <Text className="text-text-default text-m">
            <SharedLanguageSwitchRenderer
              value={PaymentFee}
              value_ar={PaymentFee_ar ?? PaymentFee}
              language={language}
            />
          </Text>
        </Container>
      </Container>

      <Container className="rounded-xs bg-cards-base-l1 gap-l px-l py-m mb-l">
        <Container className="w-full space-y-xxs">
          {/* Reference Number */}
          <Container className="flex flex-col sm:flex-row sm:items-center gap-s">
            <Container className="sm:w-[35%] flex-shrink-0">
              <Text className="text-bold-m text-text-default">
                <SharedLanguageSwitchRenderer
                  value={labels.referenceNumber}
                  value_ar={labels.referenceNumber_ar}
                  language={language}
                />
              </Text>
            </Container>
            <Container className="flex-1">
              <form.Field
                name={"referenceNumber"}
                children={(field) => (
                  <TextInput
                    value={field.state.value}
                    onChange={(val: string) => {
                      field.handleChange(val);
                      validateField("referenceNumber", val);
                    }}
                    placeholder="10192983282"
                    placeholder_ar="10192983282"
                    language={language}
                    hasError={Boolean(errors.referenceNumber)}
                    errorMessage={errors.referenceNumber}
                    errorMessage_ar={errors.referenceNumber}
                  />
                )}
              />
            </Container>
          </Container>

          {/* Receipt Date */}
          <Container className="flex flex-col sm:flex-row sm:items-center gap-s">
            <Container className="sm:w-[35%] flex-shrink-0">
              <Text className="text-bold-m text-text-default">
                <SharedLanguageSwitchRenderer
                  value={labels.receiptDate}
                  value_ar={labels.receiptDate_ar}
                  language={language}
                />
              </Text>
            </Container>
            <Container className="flex-1">
              <form.Field
                name={"receiptDate"}
                children={(field) => (
                  <TextInput
                    fieldType="date"
                    value={field.state.value}
                    onChange={(val: string) => {
                      field.handleChange(val);
                      validateField("receiptDate", val);
                    }}
                    placeholder="dd/mm/yyyy"
                    placeholder_ar="dd/mm/yyyy"
                    language={language}
                    hasError={Boolean(errors.receiptDate)}
                    errorMessage={errors.receiptDate}
                    errorMessage_ar={errors.receiptDate}
                  />
                )}
              />
            </Container>
          </Container>

          {/* Amount */}
          <Container className="flex flex-col sm:flex-row sm:items-center gap-s">
            <Container className="sm:w-[35%] flex-shrink-0">
              <Text className="text-bold-m text-text-default">
                <SharedLanguageSwitchRenderer
                  value={labels.amount}
                  value_ar={labels.amount_ar}
                  language={language}
                />
              </Text>
            </Container>
            <Container className="flex-1">
              <form.Field
                name={"amount"}
                children={(field) => (
                  <TextInput
                    fieldType="currency"
                    value={field.state.value}
                    onChange={(val: string) => {
                      field.handleChange(val);
                      validateField("amount", val);
                    }}
                    placeholder="150.00"
                    placeholder_ar="150.00"
                    language={language}
                    hasError={Boolean(errors.amount)}
                    errorMessage={errors.amount}
                    errorMessage_ar={errors.amount}
                  />
                )}
              />
            </Container>
          </Container>

          {/* Ignore Duplicate */}
          <Container className="flex gap-s items-center py-m">
            <form.Field
              name={"ignoreDuplicate"}
              children={(field) => (
                <CheckboxField
                  id="ignore-duplicate"
                  checked={Boolean(field.state.value)}
                  onChange={(_: string, checked: boolean) => {
                    field.handleChange(Boolean(checked));
                    validateField("ignoreDuplicate", Boolean(checked));
                  }}
                  label={labels.rentPaymentsFree}
                  label_ar={labels.rentPaymentsFree_ar}
                  language={language}
                />
              )}
            />
          </Container>

          <Container className="flex justify-end pt-s">
            <Buttons
              type="primary"
              size="l"
              title="Override Payment"
              title_ar="تجاوز الدفع"
              disabled={isLoading || isSubmitting}
              onClick={handleFormSubmit}
              language={language}
            />
          </Container>
        </Container>
      </Container>
    </Container>
  );
};

export default PaymentOverride;
