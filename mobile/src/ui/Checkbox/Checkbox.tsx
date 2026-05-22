import type { CustomCheckboxProps } from "@shared/types";
import React, { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import Svg, { Polyline } from "react-native-svg";

export type { CustomCheckboxProps };

export const Checkbox = ({
  id,
  checked,
  onChange,
  disabled = false,
  hasError = false,
}: CustomCheckboxProps) => {
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
      setIsChecked((prev) => !prev);
    }

    onChange?.(id, !isChecked);
  };

  const baseStyles =
    "border-2 border-form-fields-checkbox-radio-cbr-border bg-Base-White";

  const disabledStyles =
    "bg-form-fields-checkbox-radio-cbr-select-disable border-form-fields-checkbox-radio-cbr-select-disable";

  const checkedStyles = "bg-form-fields-checkbox-radio-cbr-bg-selected border-form-fields-checkbox-radio-cbr-border-selected";

  const errorStyles = "border-2 border-form-fields-error";

  let styleClass = baseStyles;
  if (disabled) {
    styleClass = disabledStyles;
  } else if (hasError) {
    styleClass = errorStyles;
  } else if (isChecked) {
    styleClass = checkedStyles;
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isChecked, disabled }}
      className={`w-6 h-6 rounded-xs items-center justify-center ${styleClass}`}
    >
      {isChecked && (
        <View>
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Polyline
              points="20 6 9 17 4 12"
              stroke={disabled ? "#9CA3AF" : "#FFFFFF"}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
      )}
    </Pressable>
  );
};
