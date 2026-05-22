import type { CheckboxInputProps } from "@shared/types";
import React from "react";
import { Label } from "../Label";
import { Caption } from "../Caption";
import { CheckboxField } from "../CheckboxField";

export type { CheckboxInputProps };

export const CheckboxInput: React.FC<CheckboxInputProps> = ({
  label,
  label_ar,
  required,
  showInfoIcon,
  tooltipText,
  tooltipText_ar,
  options = [],
  value = [],
  onChange,
  disabled = false,
  hasError = false,
  errorMessage = "",
  errorMessage_ar = "",
  captionLeft = "",
  captionLeft_ar = "",
  captionRight = "",
  captionRight_ar = "",
  theme = "light",
  language = "en",
}) => {
  const handleCheckboxChange = (optionValue: string, isChecked: boolean) => {
    let updatedSelected: string[];
    if (isChecked) {
      updatedSelected = [...value, optionValue];
    } else {
      updatedSelected = value.filter((selected) => selected !== optionValue);
    }
    onChange(updatedSelected);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label
        label={label}
        label_ar={label_ar}
        required={required}
        showInfoIcon={showInfoIcon}
        tooltipText={tooltipText}
        tooltipText_ar={tooltipText_ar}
        tooltipDirection={language === "en" ? "left-center" : "right-center"}
        theme={theme}
        language={language}
      />

      <div className="flex flex-col gap-2">
        <div className="flex gap-m flex-wrap justify-between">
          {options?.map((option) => (
            <div key={option.value} className="flex items-center gap-1">
              <CheckboxField
                id={option.value}
                label={option.label}
                label_ar={option.label_ar}
                language={language}
                checked={value.includes(option.value)}
                disabled={disabled}
                onChange={(_, checked) =>
                  handleCheckboxChange(option.value, checked)
                }
                theme={theme}
                hasError={hasError && value.length === 0}
              />
            </div>
          ))}
        </div>

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
            theme={theme}
          />
        )}
      </div>
    </div>
  );
};
