import React, { useCallback, useState } from "react";
import { Container } from "@platform/Container";
import { Text } from "@platform/Text";
import { Buttons } from "@platform/Buttons";
import { CustomDrawer } from "@platform/CustomDrawer";
import GenericCard from "../GenericCard";
import type { ButtonType } from "../CardTitle";
import SharedLanguageSwitchRenderer from "../SharedLanguageSwitchRenderer";
import PaymentOverride, { type PaymentOverrideValues } from "./PaymentOverride";
import {
  useVerifyPayment,
  type VerifyPaymentPayload,
} from "@shared/hooks/useVerifyPayment";
import {
  useOverridePayment,
  type OverridePaymentPayload,
} from "@shared/hooks/useOverridePayment";
import {
  usePrintPaymentSlip,
  type PrintPaymentSlipPayload,
} from "@shared/hooks/usePrintPaymentSlip";
import { useDownload } from "@platform/sharedHooks/useDownload";

export interface ApplicationPayment {
  applicationPaymentId?: string | number;
  applicationNumber?: string | number;
  municipalityId?: string | number;
  paymentDescriptionE?: string;
  paymentDescriptionA?: string;
  municipalityNameE?: string;
  municipalityNameA?: string;
  paidByName?: string;
  receiptNumber?: string;
  receiptDate?: string;
  status?: string;
  amountDue?: string;
  amountInWords?: string;
  vatAmount?: string;
}

export interface PaymentDetailsProps {
  language?: "en" | "ar";
  applicationId: string;
  variant?: "small" | "medium" | "large";
  drawerSize?: "layer1" | "layer2" | "layer3";

  /** Payments data passed from parent instead of fetched internally */
  payments?: ApplicationPayment[];
  isLoading?: boolean;
  showButtons?: boolean;
  buttons?: ButtonType[];

  /** Called when override payment mutation succeeds */
  onOverrideComplete?: Function;
  /** Called when verify payment mutation succeeds */
  onVerifyComplete?: Function;

  paymentOverrideTitle?: string;
  paymentOverrideTitle_ar?: string;
  paymentOverrideDescription?: string;
  paymentOverrideDescription_ar?: string;
  platform?: "web" | "mobile";
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  language = "en",
  applicationId,
  variant = "medium",
  drawerSize = "layer1",
  payments = [],
  isLoading = false,

  showButtons = true,
  buttons = [],

  onOverrideComplete,
  onVerifyComplete,

  paymentOverrideTitle = "Payment Override",
  paymentOverrideTitle_ar = "تجاوز الدفع",
  paymentOverrideDescription = "Search for the customer who wants to have the ranch land allocated to them.",
  paymentOverrideDescription_ar = "ابحث عن العميل الذي يرغب في تخصيص أرض المزرعة له.",
  platform = "web",
}) => {
  const args = applicationId;

  const [selectedPayment, setSelectedPayment] =
    useState<ApplicationPayment | null>(null);

  const [printingId, setPrintingId] = useState<number | null>(null);

  const { download } = useDownload();

  const { mutate: verifyPayment } = useVerifyPayment();
  const { mutate: overridePayment, isPending: isOverridePaymentPending } =
    useOverridePayment();
  const { mutate: printPaymentSlip } = usePrintPaymentSlip();

  const openOverrideDrawer = (payment: ApplicationPayment) => {
    setSelectedPayment(payment);
  };

  const closeOverrideDrawer = () => {
    setSelectedPayment(null);
  };

  const handleOverrideSubmit = useCallback(
    (values: PaymentOverrideValues) => {
      if (!selectedPayment) return;

      const payload: OverridePaymentPayload = {
        applicationPaymentId: Number(selectedPayment.applicationPaymentId),
        receiptNumber: values.referenceNumber,
        receiptDate: values.receiptDate,
        amount: values.amount,
        duplicateReceiptNumber: values.ignoreDuplicate,
      };

      overridePayment(
        { payload, args },
        {
          onSuccess: () => {
            closeOverrideDrawer();
            onOverrideComplete?.();
          },
        },
      );
    },
    [overridePayment, args, selectedPayment, onOverrideComplete],
  );

  if (isLoading) {
    return (
      <Container className="flex items-center justify-center">
        <Text>
          <SharedLanguageSwitchRenderer
            value="Loading..."
            value_ar="جارٍ التحميل..."
            language={language}
          />
        </Text>
      </Container>
    );
  }

  return (
    <Container
      className="w-full"
      style={{ direction: language === "en" ? "ltr" : "rtl" }}
    >
      {payments?.map((payment) => {
        const key = String(payment?.applicationPaymentId);
        const paymentIdNum = Number(payment?.applicationPaymentId);

        return (
          <Container className="py-m w-full" key={key}>
            <GenericCard
              title={payment?.paymentDescriptionE ?? ""}
              title_ar={
                payment?.paymentDescriptionA ??
                payment?.paymentDescriptionE ??
                ""
              }
              status={!payment?.receiptNumber ? "Pending" : "Paid by override"}
              status_ar={
                !payment?.receiptNumber ? "قيد الانتظار" : "مدفوع بواسطة تجاوز"
              }
              statusType={!payment?.receiptNumber ? "pending" : "success"}
              variant={variant}
              language={language}
              isExpanded
              isExpandable={false}
              showMoreButton
              rowsData={[
                {
                  label: "Amount",
                  label_ar: "المبلغ",
                  value: payment?.amountDue ?? "",
                  value_ar: payment?.amountDue ?? "",
                },
                {
                  label: "Amount in Words",
                  label_ar: "المبلغ بالحروف",
                  value: payment?.amountInWords ?? "",
                  value_ar: payment?.amountInWords ?? "",
                },
                {
                  label: "VAT Amount",
                  label_ar: "قيمة الضريبة",
                  value: payment?.vatAmount ?? "",
                  value_ar: payment?.vatAmount ?? "",
                },
                {
                  label: "Municipality",
                  label_ar: "البلدية",
                  value: payment?.municipalityNameE ?? "",
                  value_ar: payment?.municipalityNameA ?? "",
                },
                {
                  label: "Paid By",
                  label_ar: "تم الدفع بواسطة",
                  value: payment?.paidByName ?? "",
                  value_ar: payment?.paidByName ?? "",
                },
              ]}
            />

            {/* ACTION BUTTONS */}
            <Container className="flex flex-row mt-m items-center gap-s flex-wrap">
              <Buttons
                type="secondary"
                size="m"
                title="Print Pay Slip"
                title_ar="طباعة إيصال الدفع"
                language={language}
                disabled={printingId === paymentIdNum}
                onClick={() => {
                  setPrintingId(paymentIdNum);

                  const payload: PrintPaymentSlipPayload = {
                    applicationPaymentId: paymentIdNum,
                  };

                  printPaymentSlip(
                    { payload, args },
                    {
                      onSuccess: (data) => {
                        const downloadUrl = data?.result?.downloadUrl;
                        if (downloadUrl) {
                          download(downloadUrl);
                        }
                      },
                      onSettled: () => setPrintingId(null),
                    },
                  );
                }}
              />

              {!(payment?.receiptNumber && payment?.receiptDate) && (
                <>
                  <Buttons
                    type="secondary"
                    size="m"
                    title="Verify Pay Slip"
                    title_ar="تحقق من إيصال الدفع"
                    language={language}
                    onClick={() => {
                      const payload: VerifyPaymentPayload = {
                        ApplicationPaymentId: paymentIdNum,
                        MunicipalityId: Number(payment?.municipalityId),
                      };
                      verifyPayment(
                        { payload, args },
                        {
                          onSuccess: () => {
                            onVerifyComplete?.();
                          },
                        },
                      );
                    }}
                  />

                  <Buttons
                    type="secondary"
                    size="m"
                    title="Override Payment"
                    title_ar="تجاوز الدفع"
                    language={language}
                    onClick={() => openOverrideDrawer(payment)}
                  />
                </>
              )}
            </Container>
          </Container>
        );
      })}

      {/* FOOTER BUTTONS */}
      <Container className="flex flex-row pt-xl items-center justify-end gap-xs">
        {showButtons &&
          buttons?.map((button) => (
            <Buttons
              key={button.title}
              size={button.size || "l"}
              type={button.type || "secondary"}
              disabled={button.disabled}
              {...button}
              language={language}
            />
          ))}
      </Container>

      {/* OVERRIDE DRAWER */}
      <CustomDrawer
        size={drawerSize}
        language={language}
        open={Boolean(selectedPayment)}
        onOpenChange={(open: boolean) => !open && closeOverrideDrawer()}
      >
        {selectedPayment && (
          <PaymentOverride
            title={paymentOverrideTitle}
            title_ar={paymentOverrideTitle_ar}
            description={paymentOverrideDescription}
            description_ar={paymentOverrideDescription_ar}
            ServiceName={String(selectedPayment.paymentDescriptionE)}
            ServiceName_ar={String(selectedPayment.paymentDescriptionA)}
            applicationId={String(selectedPayment.applicationPaymentId)}
            applicationNo={String(selectedPayment.applicationNumber)}
            applicationNo_ar={String(selectedPayment.applicationNumber)}
            PaymentFee={String(selectedPayment.amountDue)}
            language={language}
            isLoading={isOverridePaymentPending}
            onSubmit={handleOverrideSubmit}
            platform={platform}
          />
        )}
      </CustomDrawer>
    </Container>
  );
};

export default PaymentDetails;
