import type { RadioFieldProps } from "@shared/types";
import React from "react";
import { View } from "react-native";
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
    <View className="flex flex-col gap-[10px]">
      <View className="flex flex-row items-center gap-2">
        <CheckRadioLabel
          label={label}
          label_ar={label_ar}
          language={language}
          disabled={disabled}
          onClick={() => onChange?.(value)}
        />
      </View>
    </View>
  );
};
