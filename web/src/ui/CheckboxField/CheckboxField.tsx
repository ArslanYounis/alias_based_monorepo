import type { CheckboxFieldProps } from "@shared/types";
import React from "react";
import { Label } from "../Label";
import { Checkbox } from "../Checkbox";

export type { CheckboxFieldProps };

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label = "",
  label_ar = "",
  required = false,
  checked = false,
  onChange = () => {},
  disabled = false,
  language = "en",
}) => {
  return (
    <div className="flex flex-col gap-[10px]">
      <div className="flex flex-row items-center gap-2">
        <Checkbox
          id="checkbox-field"
          checked={checked}
          onChange={(_id, value) => onChange?.(value)}
          disabled={disabled}
        />
        <Label
          label={label}
          label_ar={label_ar}
          required={required}
          language={language}
        />
      </div>
    </div>
  );
};
