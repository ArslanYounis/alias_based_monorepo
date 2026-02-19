import type { RadioFieldProps } from "@shared/types";
import React from "react";
import { Label } from "../Label";
import { CheckRadioLabel } from "../CheckRadioLabel";

export type { RadioFieldProps };

export const RadioField: React.FC<RadioFieldProps> = ({
  label = "",
  label_ar = "",
  required = false,
  checked = false,
  onChange = () => {},
  disabled = false,
  value = "",
  language = "en",
}) => {
  return (
    <div className="flex flex-col gap-[10px]">
      <div className="flex flex-row items-center gap-2">
        <input
          type="radio"
          id="radio-field"
          checked={checked}
          onChange={() => onChange?.(value)}
          disabled={disabled}
          className="text-form-fields-checkbox-radio-cb-icon border border-form-fields-checkbox-radio-cbr-border"
        />
        <CheckRadioLabel
          label={label}
          label_ar={label_ar}
          language={language}
          disabled={disabled}
          onClick={() => onChange?.(value)}
          htmlFor="radio-field"
        />
      </div>
    </div>
  );
};
