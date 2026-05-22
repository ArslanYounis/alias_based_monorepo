import type { RadioFieldProps } from "@shared/types";
import React, { useEffect, useState } from "react";
import { Radio } from "../Radio";
import { CheckRadioLabel } from "../CheckRadioLabel";

export type { RadioFieldProps };

export const RadioField: React.FC<RadioFieldProps> = ({
  id = "",
  label = "",
  label_ar = "",
  language = "en",
  checked = "",
  disabled = false,
  hasError = false,
  onChange = () => {},
  theme = "light",
}) => {
  const [internalError, setInternalError] = useState(hasError);

  useEffect(() => {
    setInternalError(hasError);
  }, [hasError]);

  const handleRadioChange = () => {
    setInternalError(false);
    onChange?.(id, true);
  };

  return (
    <div
      className="flex items-center gap-s"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <Radio
        id={id}
        checked={checked === id}
        disabled={disabled}
        hasError={internalError}
        onChange={handleRadioChange}
        theme={theme}
      />
      <CheckRadioLabel
        label={label}
        label_ar={label_ar}
        disabled={disabled}
        theme={theme}
        language={language}
        onClick={handleRadioChange}
        htmlFor={id}
      />
    </div>
  );
};
