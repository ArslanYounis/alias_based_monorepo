import type { TextInputProps } from "@shared/types";
import React from "react";
import { View } from "react-native";
import { Label } from "../Label";
import { Fields } from "../Fields";
import { Caption } from "../Caption";

export type { TextInputProps };

export const TextInput: React.FC<TextInputProps> = ({
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
  icon = null,
  disabled = false,
  captionLeft = "",
  captionLeft_ar = "",
  captionRight = "",
  captionRight_ar = "",
  language = "en",
  fieldType = "text",
  options = [],
  selectType = "single",
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
        type={fieldType}
        placeholder={
          language === "en" ? placeholder : placeholder_ar || placeholder
        }
        value={value}
        onChange={onChange}
        hasError={hasError}
        errorMessage=""
        icon={icon}
        disabled={disabled}
        language={language}
        options={options}
        selectType={selectType}
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
