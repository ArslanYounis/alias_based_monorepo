import React from "react";
import type { TypographyProps } from "@shared/types";
import SharedLanguageSwitchRenderer from "~/components/shared/SharedLanguageSwitchRenderer";

export type { TypographyProps };

const variantClasses: Record<string, string> = {
  "h1-shouting": "text-heading-h1-shouting font-bold",
  "h1-hero": "text-heading-h1-hero font-bold",
  h1: "text-heading-h1 font-bold",
  h2: "text-heading-h2 font-bold",
  h3: "text-heading-h3 font-bold",
  h4: "text-heading-h4 font-bold",
  "text-lg": "text-l font-normal",
  "text-md": "text-m font-normal",
  "text-sm": "text-s font-normal",
  "text-xs": "text-xs font-normal",
  "text-bold-lg": "text-bold-l",
  "text-bold-md": "text-bold-m",
  "text-bold-sm": "text-bold-s",
  "text-bold-xs": "text-bold-xs",
  "text-bold-xxs": "text-bold-xxs",
};

const colorClasses: Record<string, string> = {
  default: "text-text-default",
  dimmed: "text-text-dimmed",
  primary: "text-text-primary",
  link: "text-text-link",
  "link-hover": "text-text-link-hover",
};

const Typography: React.FC<TypographyProps> = ({
  variant,
  color = "default",
  text,
  text_ar,
  language = "en",
}) => {
  const variantClass = variantClasses[variant] ?? variantClasses.h1;
  const colorClass = colorClasses[color] ?? colorClasses.default;

  return (
    <SharedLanguageSwitchRenderer
      language={language}
      value={text}
      value_ar={text_ar || ""}
      className={`${variantClass} ${colorClass}`}
    />
  );
};

export default Typography;
