import React from "react";
// import { Label } from "./Label";
// import { Fields } from "./Fields";
import { Caption } from "./Caption";
import { View } from "react-native";

export interface TextInputProps {
  label?: string;
  label_ar?: string;
  required?: boolean;
  showInfoIcon?: boolean;
  tooltipText?: string;
  tooltipText_ar?: string;
  placeholder?: string;
  placeholder_ar?: string;
  value?: string;
  onChange?: (value: string) => void;
  hasError?: boolean;
  errorMessage?: string;
  errorMessage_ar?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  captionLeft?: string;
  captionLeft_ar?: string;
  captionRight?: string;
  captionRight_ar?: string;
  language?: "en" | "ar";
  fieldType?:
    | "text"
    | "date"
    | "select"
    | "textarea"
    | "uaeid"
    | "currency"
    | "phone"
    | "number";
  options?: { label?: string; label_ar?: string; value: string }[];
  selectType?: "single" | "multi";
}

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
}) => {
  return (
    <View className="flex flex-col gap-[10px]">
      {/* Label */}
      {/* <Label
        label={label}
        label_ar={label_ar}
        required={required}
        showInfoIcon={showInfoIcon}
        tooltipText={tooltipText}
        tooltipText_ar={tooltipText_ar}
        disabled={disabled}
        tooltipDirection={language === "en" ? "left-center" : "right-center"}
        language={language}
      /> */}

      {/* Fields component used here */}
      {/* <Fields
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
      /> */}

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
    </View>
  );
};
