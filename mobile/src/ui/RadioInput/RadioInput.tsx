import type { RadioInputProps } from "@shared/types";
import React from "react";
import { View } from "react-native";
import { Label } from "../Label";
import { CheckRadioLabel } from "../CheckRadioLabel";

export type { RadioInputProps };

export const RadioInput: React.FC<RadioInputProps> = ({
  label = "",
  label_ar = "",
  required = false,
  value = "",
  onChange = () => {},
  disabled = false,
  options = [],
  language = "en",
}) => {
  return (
    <View className="flex flex-col gap-[10px]">
      <Label
        label={label}
        label_ar={label_ar}
        required={required}
        language={language}
      />
      <View className="flex flex-col gap-2">
        {options.map((opt) => (
          <View key={opt.value} className="flex flex-row items-center gap-2">
            <CheckRadioLabel
              label={opt.label}
              label_ar={opt.label_ar}
              language={language}
              disabled={disabled}
              onClick={() => onChange?.(opt.value)}
            />
          </View>
        ))}
      </View>
    </View>
  );
};
