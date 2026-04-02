import type { RadioInputProps } from "@shared/types";
import React from "react";
import { View } from "react-native";
import { Label } from "../Label";
import { Caption } from "../Caption";
import { RadioField } from "../RadioField";

export type { RadioInputProps };

export const RadioInput: React.FC<RadioInputProps> = ({
  label = "",
  label_ar = "",
  required = false,
  showInfoIcon = false,
  tooltipText = "",
  tooltipText_ar = "",
  checked = "",
  onChange = () => {},
  options = [],
  disabled = false,
  hasError = false,
  errorMessage = "",
  errorMessage_ar = "",
  captionLeft = "",
  captionLeft_ar = "",
  captionRight = "",
  captionRight_ar = "",
  language = "en",
}) => {
  const handleRadioChange = (id: string) => {
    if (checked) {
      onChange(id);
    }
  };

  return (
    <View style={{ gap: 8 }}>
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

      <View style={{ gap: 8 }}>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          {options.map((option) => (
            <RadioField
              key={option.value}
              id={option.value}
              label={option.label}
              label_ar={option.label_ar}
              checked={checked}
              disabled={disabled}
              hasError={hasError}
              onChange={handleRadioChange}
              language={language}
            />
          ))}
        </View>

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
    </View>
  );
};
