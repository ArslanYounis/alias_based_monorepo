import React from "react";
import { Text, TouchableOpacity } from "react-native";
import SharedLanguageSwitchRenderer from "~/components/shared/SharedLanguageSwitchRenderer";

export interface CheckRadioLabelProps {
  label?: string;
  label_ar?: string;
  disabled?: boolean;
  language?: "en" | "ar";
  onPress?: () => void;
}

export const CheckRadioLabel: React.FC<CheckRadioLabelProps> = ({
  label,
  label_ar,
  language = "en",
  disabled = false,
  onPress,
}) => {
  const colorClass = disabled
    ? "text-form-fields-label-disabled"
    : "text-form-fields-label-text";

  return (
    <TouchableOpacity disabled={disabled} onPress={onPress} className="flex">
      <Text
        className={`text-bold-m ${colorClass}`}
        style={{
          writingDirection: language === "en" ? "ltr" : "rtl",
        }}
      >
        <SharedLanguageSwitchRenderer
          language={language}
          value={label}
          value_ar={label_ar}
        />
      </Text>
    </TouchableOpacity>
  );
};
