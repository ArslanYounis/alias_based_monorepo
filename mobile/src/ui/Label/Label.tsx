import { Tooltip } from "../Tooltip";
import React, { useState } from "react";
import { View, Pressable } from "react-native";
import InfoIcon from "~/assets/svg/icons/Info";
import SharedLanguageSwitchRenderer from "~/components/shared/SharedLanguageSwitchRenderer";

export interface LabelProps {
  label: string;
  label_ar?: string;
  required?: boolean;
  showInfoIcon?: boolean;
  tooltipText?: string;
  tooltipText_ar?: string;
  tooltipDirection?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right"
    | "left-top"
    | "left-center"
    | "left-bottom"
    | "right-top"
    | "right-center"
    | "right-bottom";
  disabled?: boolean;
  language?: "en" | "ar";
}

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
    <View
      className={`flex-row items-center gap-xxs ${
        language === "ar" ? "flex-row-reverse" : ""
      }`}
    >
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
