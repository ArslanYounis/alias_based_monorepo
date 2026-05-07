import React, { type FC } from "react";
import { Container } from "@platform/Container";
import { Text } from "@platform/Text";
import { Buttons } from "@platform/Buttons";
import { type ButtonType } from "../CardTitle";
import SharedLanguageSwitchRenderer from "../SharedLanguageSwitchRenderer";

export interface PageTitleProps {
  label?: string;
  label_ar?: string;
  language?: "en" | "ar";
  showButtons?: boolean;
  buttons?: ButtonType[];
  platform?: "web" | "mobile";
}

const PageTitle: FC<PageTitleProps> = ({
  label = "",
  label_ar = "",
  language = "en",
  showButtons = false,
  buttons = [],
  platform = "web",
}) => {
  return (
    <Container
      className="flex flex-row w-full items-center justify-between"
      dir={language === "en" ? "ltr" : "rtl"}
    >
      <Text
        className={`${platform === "web" ? "text-heading-h2" : "text-heading-h3"} font-bold text-text-default`}
      >
        <SharedLanguageSwitchRenderer
          language={language}
          value={label}
          value_ar={label_ar || label}
        />
      </Text>
      <Container className="flex flex-row gap-s my-s">
        {showButtons &&
          buttons?.map((button) => (
            <Buttons
              key={button.title}
              size={button.size || "m"}
              type={button.type || "secondary"}
              leftIcon={button.leftIcon}
              {...button}
              language={language}
            />
          ))}
      </Container>
    </Container>
  );
};

export default PageTitle;
