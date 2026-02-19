import React from "react";
import { Container } from "@platform/Container";
import { CardTitle } from "@shared/components/CardTitle";
import { Typography } from "@platform/Typography";
import { TextInput } from "@platform/TextInput";
import { Buttons } from "@platform/Buttons";

export interface ApplicationDetailProps {
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
  showButton?: boolean;
  onButtonClick?: () => void;
  language?: "en" | "ar";
}

export const ApplicationDetail: React.FC<ApplicationDetailProps> = ({
  title = "Application Details",
  title_ar,
  applicationNumber = "",
  applicationNumber_ar,
  applicationDate = "",
  applicationDate_ar,
  referenceNumber = "",
  referenceNumber_ar,
  buttonTitle = "Add Agent",
  buttonTitle_ar,
  showButton = true,
  onButtonClick,
  language = "en",
}) => {
  return (
    <Container>
      <CardTitle
        title={title}
        title_ar={title_ar || title}
        language={language}
      />
      <Typography
        variant="text-md"
        text={applicationNumber}
        text_ar={applicationNumber_ar || applicationNumber}
        language={language}
      />
      <Typography
        variant="text-md"
        text={applicationDate}
        text_ar={applicationDate_ar || applicationDate}
        language={language}
      />
      <TextInput
        label="Reference Number"
        label_ar="رقم المرجع"
        value={referenceNumber}
        onChange={() => {}}
        language={language}
      />
      {showButton && (
        <Buttons
          title={buttonTitle}
          title_ar={buttonTitle_ar || buttonTitle}
          type="primary"
          onClick={onButtonClick}
          language={language}
        />
      )}
    </Container>
  );
};

export default ApplicationDetail;
