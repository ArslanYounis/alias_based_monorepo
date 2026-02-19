import type { LabelProps } from "@shared/types";
import React, { useState } from "react";
import { View, Pressable } from "react-native";
import SharedLanguageSwitchRenderer from "~/components/shared/SharedLanguageSwitchRenderer";
import InfoIcon from "~/assets/svg/icons/Info";
import { Tooltip } from "../Tooltip";

export type { LabelProps };

export const Label: React.FC<LabelProps> = ({
  label,
  label_ar,
  required = false,
  showInfoIcon = false,
  tooltipText = "This is additional info",
  tooltipText_ar,
  tooltipDirection,
  disabled = false,
  language = "en",
}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const textColorClass = disabled
    ? "text-text-dimmed"
    : "text-form-fields-label-text";

  return (
    <View className="flex-row items-center gap-xxs">
      <View className={`text-bold-xs ${textColorClass}`}>
        <SharedLanguageSwitchRenderer
          language={language}
          value={label}
          value_ar={label_ar}
        />
      </View>

      {required && (
        <View className="text-form-fields-error text-xs">
          <SharedLanguageSwitchRenderer language={language} value="*" />
        </View>
      )}

      {showInfoIcon && (
        <View className="relative">
          <Pressable
            disabled={disabled}
            onPress={() => setIsTooltipVisible((prev) => !prev)}
            className="flex items-center justify-center"
          >
            <InfoIcon
              width={14}
              height={14}
              className={
                disabled
                  ? "text-form-fields-label-disabled"
                  : "text-form-fields-label-icon"
              }
            />
          </Pressable>

          {isTooltipVisible && !disabled && (
            <View className="absolute z-50">
              <Tooltip
                text={
                  language === "en"
                    ? tooltipText
                    : tooltipText_ar || tooltipText
                }
                direction={
                  tooltipDirection ||
                  (language === "en" ? "top-left" : "top-right")
                }
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
};
