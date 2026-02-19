import React from "react";
import { Typography } from "@platform/Typography";
import { Container } from "@platform/Container";

export interface ModalStepsProps {
  title?: string;
  title_ar?: string;
  subText?: string;
  subText_ar?: string;
  language?: "en" | "ar";
}

export const ModalSteps: React.FC<ModalStepsProps> = ({
  title = "",
  title_ar = "",
  subText = "",
  subText_ar = "",
  language = "en",
}) => {
  return (
    <Container>
      <Typography
        variant="h3"
        text={title}
        text_ar={title_ar || title}
        language={language}
      />
      <Typography
        variant="text-md"
        text={subText}
        text_ar={subText_ar || subText}
        language={language}
      />
    </Container>
  );
};

export default ModalSteps;
