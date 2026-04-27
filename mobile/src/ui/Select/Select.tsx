import type { SelectProps } from "@shared/types";
import React from "react";
import { View } from "react-native";
import { Label } from "../Label";
import { Fields } from "../Fields";
import { Caption } from "../Caption";

export type { SelectProps };

export const Select: React.FC<SelectProps> = ({
  label = "",
  label_ar = "",
  title = "",
  title_ar = "",
  required = false,
  showInfoIcon = false,
  tooltipText = "",
  tooltipText_ar = "",
  placeholder = "",
  placeholder_ar = "",
  checked = "",
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
  isPrint_Archive = false,
}) => {
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
        selectType="single"
        placeholder={placeholder}
        placeholder_ar={placeholder_ar}
        value={checked}
        onChange={onChange}
        hasError={hasError}
        errorMessage=""
        disabled={disabled}
        language={language}
        title={title}
        title_ar={title_ar}
        options={options}
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
          hasError={hasError}
          errorMessage={errorMessage}
          errorMessage_ar={errorMessage_ar}
          disabled={disabled}
        />
      )}
    </View>
  );
};
