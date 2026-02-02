import React from "react";
import SharedLanguageSwitchRenderer from "@/components/shared/SharedLanguageSwitchRenderer";

export interface CheckRadioLabelProps {
  label?: string;
  label_ar?: string;
  disabled?: boolean;
  language?: "en" | "ar";
  onClick?: () => void;
  htmlFor?: string;
}

export const CheckRadioLabel: React.FC<CheckRadioLabelProps> = ({
  label,
  label_ar,
  language = "en",
  disabled = false,
  onClick,
  htmlFor,
}) => {
  let colorClass = "text-form-fields-label-text";
  colorClass = disabled
    ? "text-form-fields-label-disabled"
    : "text-form-fields-label-text";

  return (
    <label
      className={`text-bold-m ${colorClass}`}
      style={{ direction: language === "en" ? "ltr" : "rtl" }}
      onClick={onClick}
      htmlFor={htmlFor}
    >
      <SharedLanguageSwitchRenderer
        language={language}
        value={label}
        value_ar={label_ar}
      />
    </label>
  );
};
