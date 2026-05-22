import type { DateSelectProps } from "@shared/types";
import React from "react";
import { Label } from "../Label";
import { Caption } from "../Caption";
import { Fields } from "../Fields";
import CalendarIcon from "@/assets/icons/CalendarIcon";

export type { DateSelectProps };

export const DateSelect: React.FC<DateSelectProps> = ({
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
  isPrint_Archive = false,
}) => {
  return (
    <div className="flex flex-col gap-[10px] relative overflow-visible">
      {/* Label */}
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

      {/* Fields component handling the date input */}
      <div className="relative overflow-visible">
        <Fields
          type="date"
          placeholder={
            language === "en" ? placeholder : placeholder_ar || placeholder
          }
          value={value}
          onChange={onChange}
          hasError={hasError}
          errorMessage=""
          disabled={disabled}
          icon={<CalendarIcon className="w-6 h-6" />}
          language={language}
          isPrint_Archive={isPrint_Archive}
        />
      </div>

      {/* Caption or Error */}
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
