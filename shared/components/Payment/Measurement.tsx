import React, { useEffect } from "react";
import { z } from "zod";
import { TextInput } from "@platform/TextInput";
import { Label } from "@platform/Label";
import { RadioField } from "@platform/RadioField";
import { Container } from "@platform/Container";
import { MeasurementSchema } from "./helper";
import { useCalculateRentFees } from "@shared/hooks/useCalculateRentFees";
import type { RentFeesResponse, SimpleForm } from "./types";

export type MeasurementValues = z.infer<typeof MeasurementSchema>;
export type StepErrorMap = Record<keyof MeasurementValues, string>;

export interface MeasurementProps {
  language?: "en" | "ar";
  form: SimpleForm<MeasurementValues>;
  data?: {
    plotId: number | string;
    requestLandClassificationId: number | string;
  };
  externalErrors?: Partial<StepErrorMap>;
  onLiveValidate?: () => void;
  onRentFeesCalculated?: (data: RentFeesResponse) => void;
}

type RanchOption = {
  value: "3" | "4" | "5";
  label: string;
  label_ar: string;
};

const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.25 10.75H3.75V19C3.75 19.6904 4.30964 20.25 5 20.25H19C19.6904 20.25 20.25 19.6904 20.25 19V10.75ZM14.25 6V4.75H10.5C10.0858 4.75 9.75 4.41421 9.75 4C9.75 3.58579 10.0858 3.25 10.5 3.25H14.25V2C14.25 1.58579 14.5858 1.25 15 1.25C15.4142 1.25 15.75 1.58579 15.75 2V6C15.75 6.41421 15.4142 6.75 15 6.75C14.5858 6.75 14.25 6.41421 14.25 6ZM21.75 19C21.75 20.5188 20.5188 21.75 19 21.75H5C3.48122 21.75 2.25 20.5188 2.25 19V10C2.25 9.58579 2.58579 9.25 3 9.25H21C21.4142 9.25 21.75 9.58579 21.75 10V19Z" fill="currentColor" />
    <path d="M2.25 10V6C2.25 4.48122 3.48122 3.25 5 3.25H7C7.41421 3.25 7.75 3.58579 7.75 4C7.75 4.41421 7.41421 4.75 7 4.75H5C4.30964 4.75 3.75 5.30964 3.75 6V10C3.75 10.4142 3.41421 10.75 3 10.75C2.58579 10.75 2.25 10.4142 2.25 10Z" fill="currentColor" />
    <path d="M6.25 6V2C6.25 1.58579 6.58579 1.25 7 1.25C7.41421 1.25 7.75 1.58579 7.75 2V6C7.75 6.41421 7.41421 6.75 7 6.75C6.58579 6.75 6.25 6.41421 6.25 6Z" fill="currentColor" />
    <path d="M20.25 10V6C20.25 5.30964 19.6904 4.75 19 4.75H18.5C18.0858 4.75 17.75 4.41421 17.75 4C17.75 3.58579 18.0858 3.25 18.5 3.25H19C20.5188 3.25 21.75 4.48122 21.75 6V10C21.75 10.4142 21.4142 10.75 21 10.75C20.5858 10.75 20.25 10.4142 20.25 10Z" fill="currentColor" />
  </svg>
);

const Measurement: React.FC<MeasurementProps> = ({
  language,
  form,
  data,
  onLiveValidate,
  onRentFeesCalculated,
}) => {
  const { mutate: calculateRentFees } = useCalculateRentFees();

  const ranchTypeOptions: RanchOption[] = [
    { value: "3", label: "Temporary Ranch", label_ar: "مزرعة مؤقتة" },
    { value: "4", label: "Ranch With Service", label_ar: "مزرعة مع خدمة" },
    { value: "5", label: "Ranch Without Service", label_ar: "مزرعة بدون خدمة" },
  ];

  useEffect(() => {
    let isMounted = true;

    // Determine initial tenancyContractTypeId:
    // prefer value from form (if present), otherwise use first option
    const initialRanchType =
      (form?.state?.values?.ranchType as string) || ranchTypeOptions[0].value;

    // If we don't have needed data (plotId / classification), still attempt call with what's available
    const tenancyContractTypeId = Number(initialRanchType);
    const ranchLandClassificationId = Number(data?.requestLandClassificationId);
    const plotId = Number(data?.plotId);

    // Defensive: don't call API if tenancyContractTypeId is NaN
    if (Number.isNaN(tenancyContractTypeId)) return;

    calculateRentFees(
      {
        tenancyContractTypeId,
        ranchLandClassificationId,
        plotId,
      },
      {
        onSuccess: (apiData) => {
          if (!isMounted) return;
          // keep tenancyContractTypeId consistent with RentFeesResponse (string)
          onRentFeesCalculated?.({
            ...apiData,
            tenancyContractTypeId: String(tenancyContractTypeId),
          });
        },
      }
    );

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container className="grid !grid-cols-1 sm:!grid-cols-2 gap-l">
      <Container className="space-t-m sm:col-span-2">
        <form.Field
          name={"units"}
          children={(field) => (
            <Container className="flex flex-col">
              <Container className="mb-s">
                <Label
                  label="Units of measurement"
                  label_ar="وحدة القياس"
                  required
                  tooltipText="Choose the unit for measurement"
                  tooltipText_ar="اختر وحدة القياس"
                  language={language}
                  showInfoIcon
                />
              </Container>

              <Container className="flex gap-l">
                {(["Square Feet", "Square Meters"] as const).map((type) => {
                  const id = `unit-${type}`;
                  return (
                    <RadioField
                      key={id}
                      id={id}
                      checked={field.state.value === type}
                      label={
                        type === "Square Feet" ? "Square Feet" : "Square Meters"
                      }
                      label_ar={
                        type === "Square Feet" ? "قدم مربع" : "متر مربع"
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

      {/* Ranch Type (Select) */}
      <form.Field
        name={"ranchType"}
        children={(field) => {
          return (
            <TextInput
              fieldType="select"
              label="Ranch Type"
              label_ar="فئة العزبة"
              placeholder="Select type"
              placeholder_ar="اختر النوع"
              value={field.state.value}
              onChange={(val: string) => {
                // Narrow val to the union type
                const typedVal = val as "3" | "4" | "5";
                // Update form field
                field.handleChange(typedVal);
                onLiveValidate?.();

                // const tenancyContractTypeId = Number(val);
                const tenancyContractTypeId = String(val);

                // Call rent fees calculation with the new value
                calculateRentFees(
                  {
                    tenancyContractTypeId: Number(val),
                    ranchLandClassificationId: Number(
                      data?.requestLandClassificationId
                    ),
                    plotId: Number(data?.plotId),
                  },
                  {
                    onSuccess: (apiData) => {
                      onRentFeesCalculated?.({
                        ...apiData,
                        tenancyContractTypeId, // pass the selected type
                      });
                    },
                  }
                );
              }}
              options={ranchTypeOptions.map((o) => ({
                value: o.value,
                label: o?.label,
                label_ar: o?.label_ar,
              }))}
              language={language}
              icon={<CalendarIcon />}
              required
            />
          );
        }}
      />

      <form.Field
        name={"rentFees"}
        children={(field) => {
          return (
            <TextInput
              fieldType="currency"
              label="Rent fees area per unit (in fils)"
              label_ar="قيمة الإيجار لوحدة المساحة (بالفلس)"
              placeholder="500"
              placeholder_ar="500"
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
        name={"measurementRegistrationFees"}
        children={(field) => {
          return (
            <TextInput
              fieldType="currency"
              label="Fee amount"
              label_ar="رسوم تسجيل العقد"
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
        name={"measurementAmountInWords"}
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
        name={"tenancyRemarks"}
        children={(field) => (
          <TextInput
            fieldType="textarea"
            label="Tenancy Remarks"
            label_ar="ملاحظات الايجار"
            placeholder=""
            placeholder_ar=""
            value={field.state.value ?? ""}
            onChange={(val: string) => {
              field.handleChange(val);
              onLiveValidate?.();
            }}
            language={language}
          />
        )}
      />
    </Container>
  );
};

export default Measurement;
