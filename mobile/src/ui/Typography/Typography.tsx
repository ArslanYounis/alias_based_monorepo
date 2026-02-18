import React from "react";
import type { TypographyProps } from "@shared/types";
import SharedLanguageSwitchRenderer from "~/components/shared/SharedLanguageSwitchRenderer";

export type { TypographyProps };

const variantStyles: Record<string, { fontSize: number; lineHeight?: number; fontWeight?: "normal" | "bold" }> = {
  "h1-shouting": { fontSize: 80, fontWeight: "bold" },
  "h1-hero": { fontSize: 64, fontWeight: "bold" },
  h1: { fontSize: 48, lineHeight: 56, fontWeight: "bold" },
  h2: { fontSize: 32, lineHeight: 40, fontWeight: "bold" },
  h3: { fontSize: 24, lineHeight: 32, fontWeight: "bold" },
  h4: { fontSize: 16, lineHeight: 20, fontWeight: "bold" },
  "text-lg": { fontSize: 20, lineHeight: 24, fontWeight: "normal" },
  "text-md": { fontSize: 16, lineHeight: 20, fontWeight: "normal" },
  "text-sm": { fontSize: 14, lineHeight: 18, fontWeight: "normal" },
  "text-xs": { fontSize: 12, lineHeight: 16, fontWeight: "normal" },
  "text-bold-lg": { fontSize: 20, lineHeight: 24, fontWeight: "bold" },
  "text-bold-md": { fontSize: 16, lineHeight: 20, fontWeight: "bold" },
  "text-bold-sm": { fontSize: 14, lineHeight: 18, fontWeight: "bold" },
  "text-bold-xs": { fontSize: 12, lineHeight: 18, fontWeight: "bold" },
  "text-bold-xxs": { fontSize: 10, fontWeight: "bold" },
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
  const style = variantStyles[variant] ?? variantStyles.h1;
  const colorClass = colorClasses[color] ?? colorClasses.default;

  return (
    <SharedLanguageSwitchRenderer
      language={language}
      value={text}
      value_ar={text_ar || ""}
      className={colorClass}
      style={{
        fontSize: style.fontSize,
        lineHeight: style.lineHeight,
        fontWeight: style.fontWeight,
      }}
    />
  );
};

export default Typography;
