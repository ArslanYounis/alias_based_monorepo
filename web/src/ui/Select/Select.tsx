import type { SelectProps } from "@shared/types";
import React from "react";
import { Label } from "../Label";
import { Fields } from "../Fields";
import { Caption } from "../Caption";

export type { SelectProps };

export const Select: React.FC<SelectProps> = ({
  options,
  label,
  label_ar,
  required = false,
  showInfoIcon = false,
  title,
  title_ar,
  onChange,
  checked = "",
  hasError = false,
  language = "en",
  placeholder = "Select an option...",
  placeholder_ar = "اختر خياراً...",
  tooltipText = "",
  tooltipText_ar = "",
  errorMessage = "",
  errorMessage_ar = "",
  disabled = false,
  captionLeft = "",
  captionLeft_ar = "",
  captionRight = "",
  captionRight_ar = "",
  theme = "light",
  isPrint_Archive = false,
}) => {
  return (
    <div
      className={`w-full relative flex flex-col gap-xs`}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="flex flex-col gap-xs">
        <Label
          label={label}
          label_ar={label_ar}
          required={required}
          showInfoIcon={showInfoIcon}
          tooltipText={tooltipText}
          tooltipText_ar={tooltipText_ar}
          disabled={disabled}
          tooltipDirection={language === "en" ? "left-center" : "right-center"}
          theme={theme}
          language={language}
        />

        <Fields
          type="select"
          placeholder={placeholder}
          placeholder_ar={placeholder_ar}
          value={checked}
          onChange={onChange}
          hasError={hasError}
          errorMessage=""
          disabled={disabled}
          options={options}
          theme={theme}
          title={title}
          title_ar={title_ar}
          language={language}
          isPrint_Archive={isPrint_Archive}
        />

        {(captionLeft ||
          captionRight ||
          captionLeft_ar ||
          captionRight_ar ||
          (hasError && (errorMessage || errorMessage_ar))) && (
          <Caption
            language={language}
            captionLeft={captionLeft}
            captionLeft_ar={captionLeft_ar}
            captionRight={captionRight}
            captionRight_ar={captionRight_ar}
            disabled={disabled}
            theme={theme}
            hasError={hasError}
            errorMessage={errorMessage}
            errorMessage_ar={errorMessage_ar}
          />
        )}
      </div>
    </div>
  );
};
