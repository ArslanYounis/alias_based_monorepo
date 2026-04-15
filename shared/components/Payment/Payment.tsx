import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import React, { useState, type ReactNode } from "react";
import { Fields } from "@platform/Fields";
import { Buttons } from "@platform/Buttons";
import { RadioCard } from "@platform/RadioCard";
import { Label } from "@platform/Label";
import { Container } from "@platform/Container";
import { PaymentIcon, NoPaymentIcon } from "@platform/icons";
import { Text } from "@platform/Text";
import Rent, { type RentValues } from "./Rent";
import Contract, { type ContractValues } from "./Contract";
import Insurance, { type InsuranceValues } from "./Insurance";
import Measurement, { type MeasurementValues } from "./Measurement";
import type { PaymentSubmitPayload } from "@shared/types";
import CardTitle from "../CardTitle";
import SharedLanguageSwitchRenderer from "../SharedLanguageSwitchRenderer";
import {
  RentSchema,
  ContractSchema,
  InsuranceSchema,
  MeasurementSchema,
} from "./helper";
import type { SimpleForm, RentFeesResponse } from "./types";

const totalSteps = 4;
type StepId = 0 | 1 | 2 | 3;

export type CombinedForm = z.infer<typeof ContractSchema> &
  z.infer<typeof MeasurementSchema> &
  z.infer<typeof InsuranceSchema> &
  z.infer<typeof RentSchema> & {
    tenancyRemarks?: string;
  };

export interface TenancyContractInfo {
  type?: string;
  contractDate?: string;
  contractNumber?: string;
  ranchTenancyRegistrationFee?: string;
  ranchTenancyRegistrationFeeInWord?: string;
  startDate?: string;
  endDate?: string;
  unitTypeValue?: string;
  requestLandClassificationId: number | string;
  plotId: number | string;
  tenancyContractId: number | string;
  contractDuration?: string | number;
}

export interface StepInfo {
  result?: {
    tenancyContract?: TenancyContractInfo;
    ranchInsuranceFee?: string | number;
    ranchInsuranceFeeInWord?: string;
  };
}

export interface PaymentProps {
  stepTitles?: string[];
  stepTitles_ar?: string[];
  paymentIcon?: ReactNode;
  noPaymentIcon?: ReactNode;
  language?: "en" | "ar";
  onSubmit?: (data: CombinedForm) => void;
  onSaveDraft?: () => void;
  /** Optional application identifier, passed back in submit meta */
  applicationId?: string;
  /** Pre-fetched step information (replaces internal useGetStepInfo hook) */
  stepInfo?: StepInfo;
  /** Loading state for step information */
  isStepInfoPending?: boolean;
  /**
   * Called when user clicks Submit (Payment or No Payment).
   * Receives the payload that was previously sent to the payment API.
   */
  onPaymentSubmit?: (val: {
    payload: PaymentSubmitPayload;
    meta: {
      applicationId?: string;
      values: CombinedForm;
      paymentType: "Payment" | "No Payment";
    };
  }) => void;
  /** Loading state for external payment submit (disables primary button) */
  isPaymentSubmitting?: boolean;
  /** Optional callback for external payment success (triggered by parent) */
  onSuccess?: () => void;
  platform?: "web" | "mobile";
}

const Payment: React.FC<PaymentProps> = ({
  paymentIcon = <PaymentIcon />,
  noPaymentIcon = <NoPaymentIcon />,
  language = "en",
  onSubmit,
  onSaveDraft,
  applicationId,
  stepInfo,
  isStepInfoPending = false,
  onPaymentSubmit,
  isPaymentSubmitting = false,
  platform = "web",
}) => {
  const [step, setStep] = useState<StepId>(0);
  const [paymentType, setPaymentType] = useState<
    "Payment" | "No Payment" | null
  >("Payment");

  const [rentFeesResult, setRentFeesResult] = useState<RentFeesResponse | null>(
    null
  );
  const [remarksError, setRemarksError] = useState<string | undefined>(
    undefined
  );

  const initialValues: CombinedForm = {
    // contract
    tenancyContractType:
      stepInfo?.result?.tenancyContract?.type === "New Tenancy"
        ? "new"
        : "renew",
    contractDate: stepInfo?.result?.tenancyContract?.contractDate,
    contractNumber: stepInfo?.result?.tenancyContract?.contractNumber,
    registrationFees:
      stepInfo?.result?.tenancyContract?.ranchTenancyRegistrationFee,
    amountInWords:
      stepInfo?.result?.tenancyContract?.ranchTenancyRegistrationFeeInWord,
    startDate: stepInfo?.result?.tenancyContract?.startDate,
    endDate: stepInfo?.result?.tenancyContract?.endDate,
    emergencyNumber: "",
    // measurement
    units: stepInfo?.result?.tenancyContract?.unitTypeValue,
    ranchType: rentFeesResult?.tenancyContractTypeId || "3",
    rentFees: rentFeesResult?.result?.rentFeesPerSqMeterUnit,
    measurementRegistrationFees: rentFeesResult?.result?.feeAmount,
    measurementAmountInWords: rentFeesResult?.result?.amountInWords,
    // insurance
    insuranceFee: "Yes",
    insuranceRegistrationFees: stepInfo?.result?.ranchInsuranceFee,
    insuranceAmountInWords: stepInfo?.result?.ranchInsuranceFeeInWord,
    // rent
    rentPaymentStartDate: stepInfo?.result?.tenancyContract?.startDate,
    rentPaymentEndDate: stepInfo?.result?.tenancyContract?.endDate,
    paymentAmount: "0",
    isFirstYearFreeOfPayment: false,
    exemptSocialAssistance: false,
    // no payment
    tenancyRemarks: "",
  } as const as CombinedForm;

  const rawFormApi = useForm({
    defaultValues: initialValues,

    onSubmit: async (args: unknown) => {
      const maybeValue = (args as { value?: unknown })?.value;
      const finalValue = (maybeValue as CombinedForm) ?? initialValues;
      onSubmit?.(finalValue);
    },
  });

  // narrow to our small SimpleForm<T> interface used by children
  const form: SimpleForm<CombinedForm> =
    rawFormApi as unknown as SimpleForm<CombinedForm>;

  const handlePaymentTypeChange = (id?: string) => {
    if (id === "payment") {
      setStep(0);
      setPaymentType("Payment");
    } else if (id === "no-payment") setPaymentType("No Payment");
  };

  const onNextClick = () => {
    const values = form.state.values;
    const isPayment = paymentType === "Payment";

    if (!isPayment) {
      if (!values?.tenancyRemarks?.trim()) {
        setRemarksError(
          language === "ar" ? "الملاحظات مطلوبة" : "Remarks are required"
        );
        return;
      }
    }
    setRemarksError(undefined);

    const isLastStep = step >= totalSteps - 1;

    // If it's the payment flow and not last step, just advance
    if (isPayment && !isLastStep) {
      setStep((prevStep) => (prevStep + 1) as StepId);
      return;
    }

    // Build shared payload only once
    const basePayload: PaymentSubmitPayload = {
      ranchLandClassificationId: Number(
        stepInfo?.result?.tenancyContract?.requestLandClassificationId ?? 0
      ),
      plotId: Number(stepInfo?.result?.tenancyContract?.plotId ?? 0),
      tenancyContractId: Number(
        stepInfo?.result?.tenancyContract?.tenancyContractId ?? 0
      ),
      contractDuration: String(
        stepInfo?.result?.tenancyContract?.contractDuration
      ),
      isFirstYearFreeOfPayment: values?.isFirstYearFreeOfPayment ? 1 : 0,
      isSkipPayment: !isPayment,
      remarks: values?.tenancyRemarks || "",
      exemptSocialAssistanceRecipient: values?.exemptSocialAssistance
        ? "true"
        : "false",
      type: "0",
      contractNumber: values?.contractNumber,
      contractDate: values?.contractDate,
      contractStartDate: values?.startDate,
      contractEndDate: values?.endDate,
      contractRegistrationFees: String(values?.registrationFees),
      contractAmountInWords: values?.amountInWords,
      unitType: "M",
      tenancyContractType: String(rentFeesResult?.tenancyContractTypeId),
      annualTenancyAmountPerUnit: String(values?.rentFees),
      annualTenancyAmount: String(values?.rentFees),
      annualRentFeesAmountInWords: values?.measurementAmountInWords,
      insuranceFeeAmount: String(values?.insuranceRegistrationFees) || "",
      insuranceFeeAmountInWords: values?.insuranceAmountInWords || "",
      isInsurancePayment: values?.insuranceFee === "Yes" ? 1 : 0,
      isSocialCase: values?.exemptSocialAssistance ? 1 : 0,
      startDate: values?.startDate,
      endDate: values?.endDate,
      rentPaymentStartDate: values?.rentPaymentStartDate,
      rentPaymentEndDate: values?.rentPaymentEndDate,
      paymentAmount: rentFeesResult?.result?.feeAmount
        ? Number(rentFeesResult.result.feeAmount)
        : 0,
    };

    // Submit via props so API can be handled externally
    onSubmit?.(values);
    onPaymentSubmit?.({
      payload: basePayload,
      meta: {
        applicationId,
        values,
        paymentType: isPayment ? "Payment" : "No Payment",
      },
    });
  };

  const onBackClick = () => {
    setStep((prevStep) => {
      if (prevStep > 0) {
        return (prevStep - 1) as StepId;
      }
      return prevStep;
    });
  };

  const onSaveDraftClick = () => {
    onSaveDraft?.();
  };

  const toArabicDigits = (num: number | string): string => {
    return num.toString().replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);
  };

  return (
    <Container className="flex flex-col rounded-md">
      <Container className="flex flex-col">
        {/* Payment / No Payment choice */}
        <Container className="mb-xl flex flex-row gap-m">
          <RadioCard
            icon={paymentIcon}
            label="Payment"
            label_ar="الدفع"
            iconLocation="left"
            clicked={paymentType === "Payment"}
            id="payment"
            onClick={handlePaymentTypeChange}
            language={language}
          />

          <RadioCard
            icon={noPaymentIcon}
            label="No Payment"
            label_ar="بدون دفع"
            iconLocation="left"
            clicked={paymentType === "No Payment"}
            id="no-payment"
            onClick={handlePaymentTypeChange}
            language={language}
          />
        </Container>

        {paymentType === "Payment" && (
          <>
            <CardTitle
              title={
                step === 0
                  ? "Contract"
                  : step === 1
                  ? "Measurement"
                  : step === 2
                  ? "Insurance"
                  : step === 3
                  ? "Rent"
                  : ""
              }
              title_ar={
                step === 0
                  ? "العقد"
                  : step === 1
                  ? "القياسات"
                  : step === 2
                  ? "التأمين"
                  : step === 3
                  ? "الإيجار"
                  : ""
              }
              subText={`Step ${step + 1} of ${totalSteps}`}
              subText_ar={`الخطوة ${toArabicDigits(
                step + 1
              )} من ${toArabicDigits(totalSteps)}`}
              variant={platform === "web" ? "large" : "medium"}
              language={language}
            />
            <Text className={`text-m text-text-default py-s`}>
              <SharedLanguageSwitchRenderer
                value="Please enter the valid details to continue."
                value_ar="الرجاء إدخال التفاصيل الصحيحة للمتابعة."
                language={language}
              />
            </Text>

            <Container className="mb-l">
              {step === 0 &&
                (isStepInfoPending ? (
                  <Text className="flex items-center justify-center">
                    <SharedLanguageSwitchRenderer
                      value="Loading..."
                      value_ar="جارٍ التحميل..."
                      language={language}
                    />
                  </Text>
                ) : (
                  <Contract
                    form={form as unknown as SimpleForm<ContractValues>}
                    language={language}
                  />
                ))}
              {step === 1 && (
                <Measurement
                  form={form as unknown as SimpleForm<MeasurementValues>}
                  data={stepInfo?.result?.tenancyContract}
                  language={language}
                  onRentFeesCalculated={(data) => {
                    setRentFeesResult(data);

                    try {
                      rawFormApi.reset({
                        ...form.state.values,
                        ranchType: data.tenancyContractTypeId,
                        rentFees: data.result.rentFeesPerSqMeterUnit,
                        measurementRegistrationFees: data.result.feeAmount,
                        measurementAmountInWords: data.result.amountInWords,
                      } as CombinedForm);
                    } catch (err) {
                      console.warn(
                        "Failed to set form values via setValue:",
                        err
                      );
                    }
                  }}
                />
              )}
              {step === 2 && (
                <Insurance
                  form={form as unknown as SimpleForm<InsuranceValues>}
                  language={language}
                />
              )}
              {step === 3 && (
                <Rent
                  form={form as unknown as SimpleForm<RentValues>}
                  language={language}
                />
              )}
            </Container>
          </>
        )}

        {paymentType === "No Payment" && (
          <Container className="flex flex-col gap-[10px]">
            <Label label="Remarks" label_ar="ملاحظات" language={language} />
            <form.Field
              name={"tenancyRemarks"}
              children={(field) => (
                <Fields
                  type="textarea"
                  placeholder="Write any remarks here…"
                  placeholder_ar="اكتب أي ملاحظات هنا…"
                  value={field.state.value ?? ""}
                  onChange={(val) => {
                    field.handleChange(val);
                    if (remarksError && val.trim()) {
                      setRemarksError(undefined);
                    }
                  }}
                  language={language}
                  hasError={!!remarksError}
                  errorMessage={remarksError}
                  errorMessage_ar={remarksError}
                />
              )}
            />
          </Container>
        )}
      </Container>

      {/* Footer */}
      <Container
        className={`flex flex-row ${
          platform === "web" ? "py-xl" : "py-s"
        } items-center justify-end gap-xs`}
      >
        <Buttons
          title="Continue Later"
          title_ar="استمرار لاحقًا"
          type="delete"
          size={platform === "web" ? "l" : "m"}
          onClick={onSaveDraftClick}
          language={language}
        />
        <Buttons
          title="Back"
          title_ar="رجوع"
          type="secondary"
          size={platform === "web" ? "l" : "m"}
          onClick={onBackClick}
          language={language}
          disabled={step === 0 || paymentType === "No Payment"}
        />
        <Buttons
          title={
            (paymentType === "Payment" && step === totalSteps - 1) ||
            paymentType === "No Payment"
              ? "Submit"
              : "Next"
          }
          title_ar={
            (paymentType === "Payment" && step === totalSteps - 1) ||
            paymentType === "No Payment"
              ? "إرسال"
              : "التالي"
          }
          type="primary"
          size={platform === "web" ? "l" : "m"}
          onClick={onNextClick}
          language={language}
          disabled={isPaymentSubmitting}
        />
      </Container>
    </Container>
  );
};

export default Payment;
