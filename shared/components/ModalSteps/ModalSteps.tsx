import React from "react";
import { Container } from "@platform/Container";
import { Text } from "@platform/Text";
import SharedLanguageSwitchRenderer from "../SharedLanguageSwitchRenderer";

export interface ModalStepsProps {
  title?: string;
  title_ar?: string;
  subText?: string;
  subText_ar?: string;
  language?: "en" | "ar";
}

const ModalSteps: React.FC<ModalStepsProps> = ({
  title = "",
  title_ar = "",
  subText = "",
  subText_ar = "",
  language = "en",
}) => (
  <Container
    className="flex flex-row flex-1 items-center justify-between border-b border-b-border-dimmed"
    dir={language === "ar" ? "rtl" : "ltr"}
  >
    <Text className="text-heading-h3 font-bold text-text-default mb-0">
      <SharedLanguageSwitchRenderer
        language={language}
        value={title}
        value_ar={title_ar || title}
      />
    </Text>
    <Text className="text-m text-text-default mb-0">
      <SharedLanguageSwitchRenderer
        language={language}
        value={subText}
        value_ar={subText_ar || subText}
      />
    </Text>
  </Container>
);

export default ModalSteps;
