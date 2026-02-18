import type { RadioCardProps } from "@shared/types";
import React from "react";
import { Pressable, View } from "react-native";
import SharedLanguageSwitchRenderer from "~/components/shared/SharedLanguageSwitchRenderer";

export type { RadioCardProps };

export const RadioCard: React.FC<RadioCardProps> = ({
  icon,
  label = "",
  label_ar,
  iconLocation = "left",
  language = "en",
  disabled = false,
  clicked = false,
  id,
  onClick,
}) => {
  /** Background */
  const getBackgroundClass = () => {
    if (disabled) return "bg-button-radio-card-selected-disabled";
    if (clicked) return "bg-button-radio-card-selected-disabled";
    return "bg-button-radio-card-selected-disabled opacity-40";
  };

  /** Text color */
  const getTextClass = () => {
    if (disabled) return "text-text-dimmed";
    return "text-text-default";
  };

  /** Layout direction */
  const getDirectionClass = () => {
    switch (iconLocation) {
      case "top":
        return "flex-col";
      case "right":
        return "flex-row-reverse";
      case "bottom":
        return "flex-col-reverse";
      case "left":
      default:
        return "flex-row";
    }
  };

  const handlePress = () => {
    if (!disabled && onClick) {
      onClick(id);
    }
  };

  return (
    <Pressable
      nativeID={id}
      onPress={handlePress}
      disabled={disabled}
      className={`
       ${getBackgroundClass()}
        min-h-[83px]
        flex-1
        rounded-xs
        px-l
        py-s
        flex
        justify-center
        ${disabled ? "opacity-40" : ""}
      `}
    >
      <View
        className={`flex items-center w-full 
        ${getDirectionClass()}
        `}
      >
        {icon && <View className={disabled ? "opacity-50" : ""}>{icon}</View>}

        <View className={`${getTextClass()} text-bold-ml`}>
          <SharedLanguageSwitchRenderer
            language={language}
            value={label}
            value_ar={label_ar}
          />
        </View>
      </View>
    </Pressable>
  );
};
