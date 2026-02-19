import type { CheckboxInputProps } from "@shared/types";
import React from "react";
import { Label } from "../Label";
import { Checkbox } from "../Checkbox";
import { CheckRadioLabel } from "../CheckRadioLabel";

export type { CheckboxInputProps };

export const CheckboxInput: React.FC<CheckboxInputProps> = ({
  label = "",
  label_ar = "",
  required = false,
  value = [],
  onChange = () => {},
  disabled = false,
  options = [],
  language = "en",
}) => {
  const toggle = (optionValue: string) => {
    const next = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-[10px]">
      <Label
        label={label}
        label_ar={label_ar}
        required={required}
        language={language}
      />
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <div key={opt.value} className="flex flex-row items-center gap-2">
            <Checkbox
              id={`checkbox-input-${opt.value}`}
              checked={value.includes(opt.value)}
              onChange={() => toggle(opt.value)}
              disabled={disabled}
            />
            <CheckRadioLabel
              label={opt.label}
              label_ar={opt.label_ar}
              language={language}
              disabled={disabled}
              onClick={() => toggle(opt.value)}
              htmlFor={`checkbox-input-${opt.value}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
