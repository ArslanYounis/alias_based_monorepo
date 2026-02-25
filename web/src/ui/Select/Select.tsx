import type { SelectProps } from "@shared/types";
import React from "react";
import { Label } from "../Label";
import { Fields } from "../Fields";
import { Caption } from "../Caption";

export type { SelectProps };

export const Select: React.FC<SelectProps> = ({
  label = "",
  label_ar = "",
  required = false,
  showInfoIcon = false,
  tooltipText = "",
  tooltipText_ar = "",
  placeholder = "",
  placeholder_ar = "",
  value = "",
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
  title,
  title_ar,
}) => {
  return (
    <div
      className="flex flex-col gap-2 w-full relative"
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
        selectType="single"
        placeholder={
          language === "en" ? placeholder : placeholder_ar || placeholder
        }
        value={value}
        onChange={onChange}
        hasError={hasError}
        errorMessage=""
        disabled={disabled}
        language={language}
        options={options}
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
