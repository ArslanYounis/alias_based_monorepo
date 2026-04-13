import type { CheckRadioLabelProps } from "@shared/types";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "~/src/ui/Text";
import SharedLanguageSwitchRenderer from "~/components/shared/SharedLanguageSwitchRenderer";

export type { CheckRadioLabelProps };

export const CheckRadioLabel: React.FC<CheckRadioLabelProps> = ({
  label,
  label_ar,
  language = "en",
  disabled = false,
  onClick,
  htmlFor,
}) => {
  const colorClass = disabled
    ? "text-form-fields-label-disabled"
    : "text-form-fields-label-text";

  return (
    <TouchableOpacity disabled={disabled} onPress={onClick}>
      <View className="flex">
        <Text className={`text-bold-m ${colorClass}`}>
          <SharedLanguageSwitchRenderer
            language={language}
            value={label}
            value_ar={label_ar}
          />
        </Text>
      </View>
    </TouchableOpacity>
  );
};
