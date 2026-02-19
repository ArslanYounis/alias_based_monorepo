import type { MultiSelectProps } from "@shared/types";
import React from "react";
import { View } from "react-native";
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
}) => {
  const valueStr = Array.isArray(value) ? value.join(",") : value ?? "";
  return (
    <View className="flex flex-col gap-[10px]">
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
        onChange={(v) =>
          onChange?.(typeof v === "string" ? (v ? v.split(",") : []) : v)
        }
        hasError={hasError}
        errorMessage=""
        disabled={disabled}
        language={language}
        options={options}
        showAddButton={showAddButton}
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
    </View>
  );
};
