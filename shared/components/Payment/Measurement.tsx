import React, { useEffect } from "react";
import { z } from "zod";
import { TextInput } from "@platform/TextInput";
import { Label } from "@platform/Label";
import { RadioField } from "@platform/RadioField";
import { Container } from "@platform/Container";
import { CalendarIcon } from "@platform/icons";
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
