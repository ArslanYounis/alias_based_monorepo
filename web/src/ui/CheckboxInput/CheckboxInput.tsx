import type { CheckboxInputProps } from "@shared/types";
import React from "react";
import { Label } from "../Label";
import { Caption } from "../Caption";
import { CheckboxField } from "../CheckboxField";

export type { CheckboxInputProps };

export const CheckboxInput: React.FC<CheckboxInputProps> = ({
  label = "",
  label_ar = "",
  required = false,
  showInfoIcon = false,
  tooltipText = "",
  tooltipText_ar = "",
  value = [],
  onChange = () => {},
  disabled = false,
  hasError = false,
  errorMessage = "",
  errorMessage_ar = "",
  captionLeft = "",
  captionLeft_ar = "",
  captionRight = "",
  captionRight_ar = "",
  options = [],
  language = "en",
}) => {
  const handleCheckboxChange = (optionValue: string, isChecked: boolean) => {
    const next = isChecked
      ? [...value, optionValue]
      : value.filter((v) => v !== optionValue);
    onChange(next);
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
        disabled={disabled}
        tooltipDirection={language === "en" ? "left-center" : "right-center"}
        language={language}
      />

      <div className="flex flex-col gap-2">
        <div className="flex gap-4 flex-wrap justify-between">
          {options.map((option) => (
            <div key={option.value} className="flex items-center gap-1">
              <CheckboxField
                id={option.value}
                label={option.label}
                label_ar={option.label_ar}
                language={language}
                checked={value.includes(option.value)}
                disabled={disabled}
                hasError={hasError && value.length === 0}
                onChange={(_id, checked) =>
                  handleCheckboxChange(option.value, checked)
                }
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
            disabled={disabled}
          />
        )}
      </div>
    </div>
  );
};
