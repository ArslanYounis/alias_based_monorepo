import type { RadioFieldProps } from "@shared/types";
import React, { useEffect, useState } from "react";
import { Radio } from "../Radio";
import { CheckRadioLabel } from "../CheckRadioLabel";

export type { RadioFieldProps };

export const RadioField: React.FC<RadioFieldProps> = ({
  id: idProp,
  label = "",
  label_ar = "",
  required = false,
  checked = false,
  onChange = () => {},
  disabled = false,
  hasError = false,
  value = "",
  language = "en",
}) => {
  const id = idProp || value || "radio-field";
  const [internalError, setInternalError] = useState(hasError);

  useEffect(() => {
    setInternalError(hasError);
  }, [hasError]);

  const handleRadioChange = (_id: string, _checked: boolean) => {
    setInternalError(false);
    onChange?.(value || id);
  };

  return (
    <div
      className="flex items-center gap-s"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <Radio
        id={id}
        checked={checked}
        disabled={disabled}
        hasError={internalError}
        onChange={handleRadioChange}
      />
      <CheckRadioLabel
        label={label}
        label_ar={label_ar}
        disabled={disabled}
        language={language}
        onClick={() => handleRadioChange(id, true)}
        htmlFor={id}
      />
    </div>
  );
};
