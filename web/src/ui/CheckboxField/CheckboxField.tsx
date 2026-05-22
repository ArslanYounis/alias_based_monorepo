import type { CheckboxFieldProps } from "@shared/types";
import React, { useEffect, useState } from "react";
import { Checkbox } from "../Checkbox";
import { CheckRadioLabel } from "../CheckRadioLabel";

export type { CheckboxFieldProps };

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  id,
  label,
  language = "en",
  label_ar,
  disabled = false,
  checked = false,
  hasError = false,
  onChange,
}) => {
  const [isChecked, setIsChecked] = useState(checked);
  const [internalError, setInternalError] = useState(hasError);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  useEffect(() => {
    setInternalError(hasError);
  }, [hasError]);

  const handleCheckboxChange = (id: string, newChecked: boolean) => {
    if (internalError) {
      setIsChecked(true);
      setInternalError(false);
      onChange?.(id, true);
      return;
    }
    setIsChecked(newChecked);
    onChange?.(id, newChecked);
  };

  return (
    <div
      className="flex items-center gap-s"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <Checkbox
        id={id}
        checked={isChecked}
        onChange={handleCheckboxChange}
        disabled={disabled}
        hasError={internalError}
      />
      <CheckRadioLabel
        label={label}
        disabled={disabled}
        language={language}
        label_ar={label_ar}
        htmlFor={id}
      />
    </div>
  );
};
