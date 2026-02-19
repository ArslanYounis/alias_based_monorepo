import type { RadioInputProps } from "@shared/types";
import React from "react";
import { Label } from "../Label";
import { CheckRadioLabel } from "../CheckRadioLabel";

export type { RadioInputProps };

export const RadioInput: React.FC<RadioInputProps> = ({
  label = "",
  label_ar = "",
  required = false,
  value = "",
  onChange = () => {},
  disabled = false,
  options = [],
  language = "en",
}) => {
  return (
    <div className="flex flex-col gap-[10px]">
      <Label
        label={label}
        label_ar={label_ar}
        required={required}
        language={language}
      />
      <div className="flex flex-col gap-2" role="radiogroup">
        {options.map((opt) => (
          <div key={opt.value} className="flex flex-row items-center gap-2">
            <input
              type="radio"
              id={`radio-input-${opt.value}`}
              name="radio-input-group"
              checked={value === opt.value}
              onChange={() => onChange?.(opt.value)}
              disabled={disabled}
              className="text-form-fields-checkbox-radio-cb-icon border border-form-fields-checkbox-radio-cbr-border"
            />
            <CheckRadioLabel
              label={opt.label}
              label_ar={opt.label_ar}
              language={language}
              disabled={disabled}
              onClick={() => onChange?.(opt.value)}
              htmlFor={`radio-input-${opt.value}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
