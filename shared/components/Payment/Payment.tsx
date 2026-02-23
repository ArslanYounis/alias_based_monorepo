import React, { useState, useMemo, useEffect } from "react";
import { Container } from "@platform/Container";
import { RadioCard } from "@platform/RadioCard";
import { Buttons } from "@platform/Buttons";
import { TextArea } from "@platform/TextArea";
import { CardTitle } from "@shared/components/CardTitle";
import { getPaymentDefaultValues, PAYMENT_STEP_COUNT } from "@shared/forms/payment.form";
import { buildPaymentPayload } from "@shared/utils/buildPaymentPayload";
import type { CombinedPaymentForm } from "@shared/schemas";
import type { PaymentProps } from "@shared/types/components";
import type { RentFeesResult } from "@shared/utils/buildPaymentPayload";
import { ContractStep } from "./ContractStep";
import { MeasurementStep } from "./MeasurementStep";
import { InsuranceStep } from "./InsuranceStep";
import { RentStep } from "./RentStep";

const TOTAL_STEPS = PAYMENT_STEP_COUNT;
const STEP_NAMES: Record<number, { en: string; ar: string }> = {
  0: { en: "Contract", ar: "العقد" },
  1: { en: "Measurement", ar: "القياسات" },
  2: { en: "Insurance", ar: "التأمين" },
  3: { en: "Rent", ar: "الإيجار" },
};

function toArabicDigits(num: number | string): string {
  return String(num).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);
}

export const Payment: React.FC<PaymentProps> = ({
  paymentIcon,
  noPaymentIcon,
  language = "en",
  onSubmit,
  onSaveDraft,
  applicationId,
  stepInfo,
  isStepInfoPending = false,
  onPaymentSubmit,
  isPaymentSubmitting = false,
  stepTitles,
  stepTitles_ar,
}) => {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [paymentType, setPaymentType] = useState<"Payment" | "No Payment" | null>("Payment");
  const [rentFeesResult, setRentFeesResult] = useState<RentFeesResult | null>(null);
  const [remarksError, setRemarksError] = useState<string | undefined>(undefined);

  const initialValues = useMemo<CombinedPaymentForm>(() => {
    const defaults = getPaymentDefaultValues();
    const tc = stepInfo?.result?.tenancyContract;
    if (!tc) return defaults;
    return {
      ...defaults,
      tenancyContractType: tc.type === "New Tenancy" ? "new" : "renew",
      contractDate: tc.contractDate ?? defaults.contractDate,
      contractNumber: tc.contractNumber ?? defaults.contractNumber,
      registrationFees: tc.ranchTenancyRegistrationFee ?? defaults.registrationFees,
      amountInWords: tc.ranchTenancyRegistrationFeeInWord ?? defaults.amountInWords,
      startDate: tc.startDate ?? defaults.startDate,
      endDate: tc.endDate ?? defaults.endDate,
      units: (tc.unitTypeValue as CombinedPaymentForm["units"]) ?? defaults.units,
      insuranceRegistrationFees:
        stepInfo?.result?.ranchInsuranceFee != null
          ? String(stepInfo.result.ranchInsuranceFee)
          : defaults.insuranceRegistrationFees,
      insuranceAmountInWords: stepInfo?.result?.ranchInsuranceFeeInWord ?? defaults.insuranceAmountInWords,
      rentPaymentStartDate: tc.startDate ?? defaults.rentPaymentStartDate,
      rentPaymentEndDate: tc.endDate ?? defaults.rentPaymentEndDate,
    };
  }, [stepInfo?.result?.tenancyContract, stepInfo?.result?.ranchInsuranceFee, stepInfo?.result?.ranchInsuranceFeeInWord]);

  const [values, setValues] = useState<CombinedPaymentForm>(initialValues);

  useEffect(() => {
    setValues((prev) => {
      const tc = stepInfo?.result?.tenancyContract;
      const next: CombinedPaymentForm = { ...prev };
      if (tc) {
        next.tenancyContractType = tc.type === "New Tenancy" ? "new" : "renew";
        if (tc.contractDate != null) next.contractDate = tc.contractDate;
        if (tc.contractNumber != null) next.contractNumber = tc.contractNumber;
        if (tc.ranchTenancyRegistrationFee != null) next.registrationFees = String(tc.ranchTenancyRegistrationFee);
        if (tc.ranchTenancyRegistrationFeeInWord != null) next.amountInWords = tc.ranchTenancyRegistrationFeeInWord;
        if (tc.startDate != null) next.startDate = tc.startDate;
        if (tc.endDate != null) next.endDate = tc.endDate;
        if (tc.unitTypeValue != null) next.units = tc.unitTypeValue as CombinedPaymentForm["units"];
        if (tc.startDate != null) next.rentPaymentStartDate = tc.startDate;
        if (tc.endDate != null) next.rentPaymentEndDate = tc.endDate;
      }
      if (stepInfo?.result?.ranchInsuranceFee != null)
        next.insuranceRegistrationFees = String(stepInfo.result.ranchInsuranceFee);
      if (stepInfo?.result?.ranchInsuranceFeeInWord != null)
        next.insuranceAmountInWords = stepInfo.result.ranchInsuranceFeeInWord;
      if (rentFeesResult) {
        next.ranchType = (rentFeesResult.tenancyContractTypeId ?? prev.ranchType) as "3" | "4" | "5";
        next.rentFees = rentFeesResult.result?.rentFeesPerSqMeterUnit ?? prev.rentFees;
        next.measurementRegistrationFees = rentFeesResult.result?.feeAmount ?? prev.measurementRegistrationFees;
        next.measurementAmountInWords = rentFeesResult.result?.amountInWords ?? prev.measurementAmountInWords;
      }
      return next;
    });
  }, [stepInfo?.result?.tenancyContract, stepInfo?.result?.ranchInsuranceFee, stepInfo?.result?.ranchInsuranceFeeInWord, rentFeesResult]);

  const handleChange = (key: keyof CombinedPaymentForm, value: unknown) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handlePaymentTypeChange = (id?: string) => {
    if (id === "payment") {
      setStep(0);
      setPaymentType("Payment");
    } else if (id === "no-payment") {
      setPaymentType("No Payment");
    }
  };

  const onNextClick = () => {
    const isPayment = paymentType === "Payment";
    const tenancyRemarks = values.tenancyRemarks ?? "";

    if (!isPayment) {
      if (!tenancyRemarks.trim()) {
        setRemarksError(language === "ar" ? "الملاحظات مطلوبة" : "Remarks are required");
        return;
      }
    }
    setRemarksError(undefined);

    const isLastStep = step >= TOTAL_STEPS - 1;

    if (isPayment && !isLastStep) {
      setStep((prev) => Math.min(prev + 1, 3) as 0 | 1 | 2 | 3);
      return;
    }

    const payload = buildPaymentPayload(values, stepInfo, isPayment ? "Payment" : "No Payment", tenancyRemarks, rentFeesResult);
    onSubmit?.(values);
    onPaymentSubmit?.({
      payload,
      meta: {
        applicationId,
        values,
        paymentType: isPayment ? "Payment" : "No Payment",
      },
    });
  };

  const onBackClick = () => {
    setStep((prev) => (prev > 0 ? (prev - 1) as 0 | 1 | 2 | 3 : prev));
  };

  const onSaveDraftClick = () => {
    onSaveDraft?.();
  };

  const stepTitleEn = stepTitles?.[step] ?? STEP_NAMES[step]?.en ?? "";
  const stepTitleAr = stepTitles_ar?.[step] ?? STEP_NAMES[step]?.ar ?? "";

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      noValidate
      dir={language === "ar" ? "rtl" : "ltr"}
      className="flex flex-col flex-1"
    >
      <Container className="flex flex-col flex-1">
        <Container className="mb-6 flex flex-col sm:flex-row gap-4">
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
              title={stepTitleEn}
              title_ar={stepTitleAr}
              subText={`Step ${step + 1} of ${TOTAL_STEPS}`}
              subText_ar={`الخطوة ${toArabicDigits(step + 1)} من ${toArabicDigits(TOTAL_STEPS)}`}
              variant="large"
              language={language}
            />
            <Container className="mb-6">
              {isStepInfoPending && step === 0 ? (
                <Container className="py-4">
                  {language === "ar" ? "جارٍ التحميل..." : "Loading..."}
                </Container>
              ) : (
                <>
                  {step === 0 && (
                    <ContractStep values={values} onChange={handleChange} language={language} />
                  )}
                  {step === 1 && (
                    <MeasurementStep
                      values={values}
                      onChange={handleChange}
                      language={language}
                    />
                  )}
                  {step === 2 && (
                    <InsuranceStep values={values} onChange={handleChange} language={language} />
                  )}
                  {step === 3 && (
                    <RentStep values={values} onChange={handleChange} language={language} />
                  )}
                </>
              )}
            </Container>
          </>
        )}

        {paymentType === "No Payment" && (
          <Container className="flex flex-col gap-2">
            <TextArea
              label="Remarks"
              label_ar="ملاحظات"
              placeholder={language === "ar" ? "اكتب أي ملاحظات هنا…" : "Write any remarks here…"}
              value={values.tenancyRemarks ?? ""}
              onChange={(v) => {
                handleChange("tenancyRemarks", v);
                if (remarksError && v.trim()) setRemarksError(undefined);
              }}
              hasError={!!remarksError}
              errorMessage={remarksError}
              errorMessage_ar={remarksError}
              language={language}
            />
          </Container>
        )}
      </Container>

      <Container className="flex pt-6 items-center justify-end gap-2">
        <Buttons
          title="Continue Later"
          title_ar="استمرار لاحقًا"
          type="delete"
          size="l"
          onClick={onSaveDraftClick}
          language={language}
        />
        <Buttons
          title="Back"
          title_ar="رجوع"
          type="secondary"
          size="l"
          onClick={onBackClick}
          language={language}
          disabled={step === 0 || paymentType === "No Payment"}
        />
        <Buttons
          title={
            (paymentType === "Payment" && step === TOTAL_STEPS - 1) || paymentType === "No Payment"
              ? "Submit"
              : "Next"
          }
          title_ar={
            (paymentType === "Payment" && step === TOTAL_STEPS - 1) || paymentType === "No Payment"
              ? "إرسال"
              : "التالي"
          }
          type="primary"
          size="l"
          onClick={onNextClick}
          language={language}
          disabled={isPaymentSubmitting}
        />
      </Container>
    </form>
  );
};
