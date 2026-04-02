import type { RadioFieldProps } from "@shared/types";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Radio } from "../Radio";
import { CheckRadioLabel } from "../CheckRadioLabel";

export type { RadioFieldProps };

export const RadioField: React.FC<RadioFieldProps> = ({
  id = "",
  label = "",
  label_ar = "",
  checked = "",
  onChange = () => {},
  disabled = false,
  hasError = false,
  language = "en",
}) => {
  const [internalError, setInternalError] = useState(hasError);

  useEffect(() => {
    setInternalError(hasError);
  }, [hasError]);

  const handleRadioChange = (_id: string, _checked: boolean) => {
    setInternalError(false);
    onChange?.(id, true);
  };

  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
      accessibilityRole="none"
    >
      <Radio
        id={id}
        checked={checked === id}
        disabled={disabled}
        hasError={internalError}
        onChange={handleRadioChange}
      />
      <CheckRadioLabel
        label={label}
        label_ar={label_ar}
        language={language}
        disabled={disabled}
        onClick={() => handleRadioChange(id, true)}
      />
    </View>
  );
};
