import React from "react";
import { Container } from "@platform/Container";
import { Text } from "@platform/Text";
import { Buttons } from "@platform/Buttons";
import CardTitle from "../CardTitle";
import SharedLanguageSwitchRenderer from "../SharedLanguageSwitchRenderer";

export interface ApplicationSummaryDetailProps {
  title?: string;
  title_ar?: string;
  applicationNumber?: string;
  applicationNumber_ar?: string;
  applicationDate?: string;
  applicationDate_ar?: string;
  referenceNumber?: string;
  referenceNumber_ar?: string;
  buttonTitle?: string;
  buttonTitle_ar?: string;
  buttonType?: "primary" | "secondary" | "tertiary" | "text-link" | "delete";
  showButton?: boolean;
  onButtonClick?: () => void;
  onReferenceNumberChange?: (value: string) => void;
  language?: "en" | "ar";
}

const ApplicationSummaryDetail: React.FC<ApplicationSummaryDetailProps> = ({
  title = "Application Detail",
  title_ar = "تفاصيل الطلب",
  applicationNumber = "",
  applicationNumber_ar = "",
  applicationDate = "",
  applicationDate_ar = "",
  referenceNumber = "",
  referenceNumber_ar = "",
  buttonTitle = "View",
  buttonTitle_ar = "عرض",
  buttonType = "secondary",
  showButton = true,
  onButtonClick,
  language = "en",
}) => {
  const isArabic = language === "ar";

  const renderLabel = (en: string, ar: string) => (
    <SharedLanguageSwitchRenderer
      language={language}
      value={en}
      value_ar={ar}
    />
  );

  const renderValue = (en?: string, ar?: string) => (
    <SharedLanguageSwitchRenderer
      language={language}
      value={en || ""}
      value_ar={ar || en || ""}
    />
  );

  interface DetailRowProps {
    labelEn: string;
    labelAr: string;
    valueEn?: string;
    valueAr?: string;
    withBorder?: boolean;
    isInput?: boolean;
  }

  const DetailRow = ({
    labelEn,
    labelAr,
    valueEn,
    valueAr,
    withBorder,
    isInput,
  }: DetailRowProps) => (
    <Container
      className={`flex flex-row items-center gap-s ${
        withBorder ? "border-b border-border-dimmed pb-s mb-s" : ""
      }`}
    >
      <Container className="flex-1">
        <Text className="text-bold-m text-text-default">
          {renderLabel(labelEn, labelAr)}
        </Text>
      </Container>

      <Container className="flex-1">
        {isInput ? (
          <Container className="text-text-default bg-form-fields-input-form-bg border border-form-fields-input-form-border w-full h-9 rounded-xxs px-m py-xs flex items-center">
            <Text className="text-m text-text-default">
              {renderValue(
                isArabic ? valueAr : valueEn,
                isArabic ? valueAr : valueEn
              )}
            </Text>
          </Container>
        ) : (
          <Text className="text-m text-text-default">
            {renderValue(valueEn, valueAr)}
          </Text>
        )}
      </Container>
    </Container>
  );

  const hasDate = applicationDate || applicationDate_ar;
  const hasReference = referenceNumber || referenceNumber_ar;

  return (
    <Container className="flex flex-col w-full">
      <Container className="flex flex-row justify-between items-center w-full">
        {title && (
          <Container className="flex-1 min-w-0">
            <CardTitle
              title={title}
              title_ar={title_ar}
              variant="small"
              language={language}
            />
          </Container>
        )}

        {showButton && (
          <Buttons
            title={buttonTitle}
            title_ar={buttonTitle_ar}
            type={buttonType}
            size="s"
            onClick={onButtonClick}
            language={language}
          />
        )}
      </Container>

      <Container className="w-full px-l py-m rounded-xs bg-cards-base-l1 border border-cards-stroke">
        <DetailRow
          labelEn="Application Number"
          labelAr="رقم الطلب"
          valueEn={applicationNumber}
          valueAr={applicationNumber_ar}
          withBorder={!!hasDate}
        />

        {hasDate && (
          <DetailRow
            labelEn="Application Date"
            labelAr="تاريخ الطلب"
            valueEn={applicationDate}
            valueAr={applicationDate_ar}
            withBorder={!!hasReference}
          />
        )}

        {hasReference && (
          <DetailRow
            labelEn="Reference Number"
            labelAr="رقم المرجع"
            valueEn={referenceNumber}
            valueAr={referenceNumber_ar}
            isInput
          />
        )}
      </Container>
    </Container>
  );
};

export default ApplicationSummaryDetail;
