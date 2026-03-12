import React from "react";
import { Container } from "@platform/Container";
import { Text } from "@platform/Text";
import SharedLanguageSwitchRenderer from "../SharedLanguageSwitchRenderer";

export interface ModalTitleProps {
  label?: string;
  label_ar?: string;
  language?: "en" | "ar";
  platform?: "web" | "mobile";
}

const ModalTitle: React.FC<ModalTitleProps> = ({
  label = "",
  label_ar = "",
  language = "en",
  platform = "web",
}) => (
  <Container className="flex flex-1" dir={language === "ar" ? "rtl" : "ltr"}>
    <Text
      className={`${
        platform === "web" ? "text-heading-h1" : "text-heading-h3"
      } font-bold text-text-default`}
    >
      <SharedLanguageSwitchRenderer
        language={language}
        value={label}
        value_ar={label_ar || label}
      />
    </Text>
  </Container>
);

export default ModalTitle;
