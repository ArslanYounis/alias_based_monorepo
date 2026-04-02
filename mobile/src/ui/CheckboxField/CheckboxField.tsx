import type { CheckboxFieldProps } from "@shared/types";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Checkbox } from "../Checkbox";
import { CheckRadioLabel } from "../CheckRadioLabel";

export type { CheckboxFieldProps };

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  id: idProp,
  label = "",
  label_ar = "",
  required = false,
  checked = false,
  onChange = () => {},
  disabled = false,
  hasError = false,
  language = "en",
}) => {
  const id = idProp ?? "checkbox-field";
  const [internalError, setInternalError] = useState(hasError);

  useEffect(() => {
    setInternalError(hasError);
  }, [hasError]);

  const handleCheckboxChange = (id: string, newChecked: boolean) => {
    if (internalError) {
      setInternalError(false);
      onChange?.(id, true);
      return;
    }
    onChange?.(id, newChecked);
  };

  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
      accessibilityRole="none"
    >
      <Checkbox
        id={id}
        checked={checked}
        onChange={handleCheckboxChange}
        disabled={disabled}
        hasError={internalError}
      />
      <CheckRadioLabel
        label={label}
        label_ar={label_ar}
        language={language}
        disabled={disabled}
        onClick={() => handleCheckboxChange(id, !checked)}
      />
    </View>
  );
};
