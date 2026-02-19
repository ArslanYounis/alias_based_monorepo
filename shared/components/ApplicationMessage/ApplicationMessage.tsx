import React from "react";
import { Container } from "@platform/Container";
import { Typography } from "@platform/Typography";
import { Buttons } from "@platform/Buttons";

export interface ApplicationMessageProps {
  title?: string;
  description?: string;
  status?: "success" | "error" | "information" | "action";
  type?: string;
  fieldType?: string;
  selectType?: string;
  label?: string;
  label_ar?: string;
  value?: unknown;
  options?: unknown[];
  required?: boolean;
  disabled?: boolean;
  showInfoIcon?: boolean;
  tooltipText?: string;
  tooltipText_ar?: string;
  onClick?: () => void;
  onInputChange?: (eventData: unknown) => void;
  language?: "en" | "ar";
}

export const ApplicationMessage: React.FC<ApplicationMessageProps> = ({
  title = "Application Submitted Successfully",
  description = "Your application has been submitted and is currently under review.",
  status = "success",
  onClick,
  language = "en",
}) => {
  return (
    <Container>
      <Typography variant="h3" text={title} language={language} />
      <Typography variant="text-md" text={description} language={language} />
      <Typography variant="text-sm" text={`Status: ${status}`} language={language} />
      {onClick && (
        <Buttons
          title="OK"
          type="primary"
          onClick={onClick}
          language={language}
        />
      )}
    </Container>
  );
};

export default ApplicationMessage;
