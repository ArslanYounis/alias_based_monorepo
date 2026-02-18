import React from "react";
import type { TypographyProps } from "@shared/types";
import SharedLanguageSwitchRenderer from "@/components/shared/SharedLanguageSwitchRenderer";

export type { TypographyProps };

const variantClasses: Record<string, string> = {
  "h1-shouting": "text-[80px] font-bold leading-auto",
  "h1-hero": "text-[64px] font-bold leading-auto",
  h1: "text-[48px] leading-[56px] font-bold",
  h2: "text-[32px] leading-[40px] font-bold",
  h3: "text-[24px] leading-[32px] font-bold",
  h4: "text-[16px] leading-[20px] font-bold",
  "text-lg": "text-[20px] leading-[24px] font-normal",
  "text-md": "text-[16px] leading-[20px] font-normal",
  "text-sm": "text-[14px] leading-[18px] font-normal",
  "text-xs": "text-[12px] leading-[16px] font-normal",
  "text-bold-lg": "text-[20px] leading-[24px] font-bold",
  "text-bold-md": "text-[16px] leading-[20px] font-bold",
  "text-bold-sm": "text-[14px] leading-[18px] font-bold",
  "text-bold-xs": "text-[12px] leading-[18px] font-bold",
  "text-bold-xxs": "text-[10px] leading-auto font-bold",
};

const Typography: React.FC<TypographyProps> = ({
  variant,
  color = "default",
  text,
  text_ar,
  language = "en",
}) => {
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
    <div
      dir={direction}
      className={`${variantClasses[variant]} ${textColor}`}
    >
      <SharedLanguageSwitchRenderer
        language={language}
        value={text}
        value_ar={text_ar || ""}
      />
    </div>
  );
};

export default Typography;
