import React from "react";
import type { TypographyProps } from "@shared/types";
import SharedLanguageSwitchRenderer from "@/components/shared/SharedLanguageSwitchRenderer";

export type { TypographyProps };

const Typography: React.FC<TypographyProps> = ({
  variant,
  color = "default",
  text,
  text_ar,
  language = "en",
}) => {
  const variantClasses: Record<string, string> = {
    "h1-shouting": "text-heading-h1-shouting font-bold",
    "h1-hero": "text-heading-h1-hero font-bold",
    h1: "text-heading-h1 font-bold",
    h2: "text-[32px] leading-[40px] font-bold",
    h3: "text-[24px] leading-[32px] font-bold",
    h4: "text-heading-h4 font-bold",
    "text-lg": "text-l font-normal",
    "text-md": "text-m font-normal",
    "text-sm": "text-s font-normal",
    "text-xs": "text-xs font-normal",
    "text-bold-lg": "text-bold-l",
    "text-bold-md": "text-bold-m",
    "text-bold-sm": "text-bold-s",
    "text-bold-xs": "text-[12px] leading-[18px] font-bold",
    "text-bold-xxs": "text-bold-xxs",
  };

  const textColor =
    color === "default"
      ? "text-text-default"
      : color === "dimmed"
      ? "text-text-dimmed"
      : color === "primary"
      ? "text-text-primary"
      : color === "link"
      ? "text-text-link"
      : "text-text-link-hover";

  const direction = language === "en" ? "ltr" : "rtl";

  return (
    <div dir={direction} className={`${variantClasses[variant]} ${textColor}`}>
      <SharedLanguageSwitchRenderer
        language={language}
        value={text}
        value_ar={text_ar || ""}
      />
    </div>
  );
};

export default Typography;
