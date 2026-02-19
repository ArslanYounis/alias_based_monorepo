import type { PaymentDetailsProps } from "@shared/types";
import React from "react";
import { Buttons } from "../../ui/Buttons";

export type { PaymentDetailsProps };

export const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  applicationId,
  variant = "medium",
  payments = [],
  showButtons = false,
  buttons = [],
  isLoading = false,
  paymentOverrideTitle,
  paymentOverrideTitle_ar,
  onOverrideComplete,
  onVerifyComplete,
  language = "en",
}) => {
  if (isLoading) {
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
      <div className="space-y-4">
        {payments.map((p, i) => (
          <div
            key={p.applicationPaymentId ?? i}
            className="p-3 rounded bg-neutral-50 dark:bg-neutral-800"
          >
            <p className="font-medium text-text-default">
              {language === "ar" ? p.paymentDescriptionA ?? p.paymentDescriptionE : p.paymentDescriptionE}
            </p>
            <p className="text-sm text-text-dimmed">
              {p.amountDue} · {p.municipalityNameE}
            </p>
          </div>
        ))}
      </div>
      {paymentOverrideTitle && (
        <div className="mt-4">
          <Buttons
            type="primary"
            size="m"
            title={language === "ar" ? paymentOverrideTitle_ar ?? paymentOverrideTitle : paymentOverrideTitle}
            onClick={() => onOverrideComplete?.({} as Parameters<NonNullable<PaymentDetailsProps["onOverrideComplete"]>>[0])}
            language={language}
          />
        </div>
      )}
      {showButtons && buttons.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {buttons.map((btn, i) => (
            <Buttons
              key={i}
              type={btn.type}
              size="m"
              title={language === "ar" ? btn.title_ar ?? btn.title : btn.title}
              onClick={btn.onClick}
              disabled={btn.disabled}
              language={language}
            />
          ))}
        </div>
      )}
    </div>
  );
};
