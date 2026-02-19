import type { PaymentProps } from "@shared/types";
import React, { useState } from "react";
import { Buttons } from "../../ui/Buttons";

export type { PaymentProps };

export const Payment: React.FC<PaymentProps> = ({
  applicationId,
  stepInfo,
  isStepInfoPending = false,
  isPaymentSubmitting = false,
  onPaymentSubmit,
  onSubmit,
  onSuccess,
  onSaveDraft,
  language = "en",
}) => {
  const [step, setStep] = useState(1);

  if (isStepInfoPending) {
    return (
      <div className="p-8 text-center text-text-default">
        {language === "ar" ? "جاري التحميل..." : "Loading..."}
      </div>
    );
  }

  return (
    <div
      className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-4"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {applicationId && (
        <p className="text-sm text-text-dimmed mb-4">
          {language === "ar" ? "رقم الطلب" : "Application ID"}: {applicationId}
        </p>
      )}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          className={`px-3 py-1 rounded ${step === 1 ? "bg-structure-primary-5 text-white" : "bg-neutral-200 dark:bg-neutral-700"}`}
          onClick={() => setStep(1)}
        >
          1
        </button>
        <button
          type="button"
          className={`px-3 py-1 rounded ${step === 2 ? "bg-structure-primary-5 text-white" : "bg-neutral-200 dark:bg-neutral-700"}`}
          onClick={() => setStep(2)}
        >
          2
        </button>
      </div>
      <div className="mb-4">
        {step === 1 && (
          <p className="text-text-default">
            {stepInfo?.result?.tenancyContract
              ? "Contract step"
              : "Step 1 content"}
          </p>
        )}
        {step === 2 && (
          <p className="text-text-default">Payment step</p>
        )}
      </div>
      <div className="flex gap-2">
        <Buttons
          type="secondary"
          size="m"
          title={language === "ar" ? "مسودة" : "Save draft"}
          onClick={() => onSaveDraft?.({} as Parameters<NonNullable<PaymentProps["onSaveDraft"]>>[0])}
          language={language}
        />
        <Buttons
          type="primary"
          size="m"
          title={language === "ar" ? "إرسال" : "Submit"}
          disabled={isPaymentSubmitting}
          onClick={() => {
            onSubmit?.({} as Parameters<NonNullable<PaymentProps["onSubmit"]>>[0]);
            onSuccess?.({} as Parameters<NonNullable<PaymentProps["onSuccess"]>>[0]);
          }}
          language={language}
        />
      </div>
    </div>
  );
};
