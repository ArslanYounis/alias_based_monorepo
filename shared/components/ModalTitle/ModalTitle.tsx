import React from "react";
import { Typography } from "@platform/Typography";

export interface ModalTitleProps {
  label?: string;
  label_ar?: string;
  language?: "en" | "ar";
}

export const ModalTitle: React.FC<ModalTitleProps> = ({
  label = "",
  label_ar = "",
  language = "en",
}) => {
  return (
    <Typography
      variant="h1"
      text={label}
      text_ar={label_ar || label}
      language={language}
    />
  );
};

export default ModalTitle;
