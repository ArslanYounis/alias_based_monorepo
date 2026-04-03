import type { MultiSelectProps } from "@shared/types";
import React from "react";
import { Label } from "../Label";
import { Fields } from "../Fields";
import { Caption } from "../Caption";

export type { MultiSelectProps };

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label = "",
  label_ar = "",
  required = false,
  showInfoIcon = false,
  tooltipText = "",
  tooltipText_ar = "",
  placeholder = "",
  placeholder_ar = "",
  value,
  onChange = () => {},
  hasError = false,
  errorMessage = "",
  errorMessage_ar = "",
  disabled = false,
  captionLeft = "",
  captionLeft_ar = "",
  captionRight = "",
  captionRight_ar = "",
  language = "en",
  options = [],
  showAddButton = false,
  title,
  title_ar,
}) => {
  const valueStr = Array.isArray(value) ? value.join(",") : value ?? "";
  // Convert OptionType[] to Fields Option[]
  const fieldOptions = options.map((opt) => ({
    label: opt.label,
    label_ar: opt.label_ar,
    value: opt.value,
  }));

  return (
    <div
      className="flex flex-col gap-xs w-full"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <Label
        label={label}
        label_ar={label_ar}
        required={required}
        showInfoIcon={showInfoIcon}
        tooltipText={tooltipText}
        tooltipText_ar={tooltipText_ar}
        disabled={disabled}
        tooltipDirection={language === "en" ? "left-center" : "right-center"}
        language={language}
      />
      <Fields
        type="select"
        selectType="multi"
        placeholder={
          language === "en" ? placeholder : placeholder_ar || placeholder
        }
        value={valueStr}
        onChange={(val) => {
          // val will be a comma-separated string from Fields, convert to array
          if (typeof val === "string") {
            const arr = val
              .split(",")
              .map((v) => v.trim())
              .filter(Boolean);
            onChange?.(arr);
          } else if (Array.isArray(val)) {
            onChange?.(val);
          }
        }}
        hasError={hasError}
        errorMessage=""
        disabled={disabled}
        language={language}
        options={fieldOptions}
        showAddButton={showAddButton}
        title={title}
        title_ar={title_ar}
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
          hasError={hasError}
          errorMessage={errorMessage}
          errorMessage_ar={errorMessage_ar}
          disabled={disabled}
        />
      )}
    </div>
  );
};
