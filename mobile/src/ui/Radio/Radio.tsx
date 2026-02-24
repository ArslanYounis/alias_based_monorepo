import type { RadioProps } from "@shared/types";
import React, { useState, useEffect } from "react";
import { Pressable, View } from "react-native";

export type { RadioProps };

export const Radio: React.FC<RadioProps> = ({
  id,
  checked,
  disabled = false,
  hasError = false,
  onChange,
}) => {
  const isControlled = typeof checked === "boolean";
  const [isChecked, setIsChecked] = useState(!!checked);

  useEffect(() => {
    if (isControlled) {
      setIsChecked(!!checked);
    }
  }, [checked, isControlled]);

  const handlePress = () => {
    if (disabled) return;
    if (!isControlled) {
      setIsChecked(true);
    }
    onChange?.(id, !isChecked);
  };

  const baseStyles = "border border-form-fields-checkbox-radio-cbr-border";
  const errorStyles = "border border-status-failed-solid";
  const disabledStyles =
    "border border-form-fields-checkbox-radio-cbr-select-disable";
  const checkedDisabledStyles =
    "border-2 border-form-fields-checkbox-radio-cbr-select-disable";
  const checkedStyles =
    "border-2 border-form-fields-checkbox-radio-cbr-bg-selected bg-form-fields-checkbox-radio-cb-icon-selected";

  let styleClass = baseStyles;
  if (hasError) {
    styleClass = errorStyles;
  } else if (isChecked && disabled) {
    styleClass = checkedDisabledStyles;
  } else if (isChecked) {
    styleClass = checkedStyles;
  } else if (disabled) {
    styleClass = disabledStyles;
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityState={{ checked: isChecked, disabled }}
      accessibilityLabel={id}
      className={`w-6 h-6 rounded-full items-center justify-center ${styleClass}`}
    >
      {isChecked && !hasError && (
        <View className="w-3 h-3 rounded-full bg-form-fields-checkbox-radio-cb-icon-selected" />
      )}
      {isChecked && hasError && (
        <View className="w-3 h-3 rounded-full bg-status-failed-solid" />
      )}
    </Pressable>
  );
};
