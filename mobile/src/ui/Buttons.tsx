import React, { ReactElement, cloneElement } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import SharedLanguageSwitchRenderer from "~/components/shared/SharedLanguageSwitchRenderer";
// import { Tooltip } from "./Tooltip";

export interface NewButtonProps {
  language?: "en" | "ar";
  size?: "s" | "m" | "l";
  fullWidth?: boolean;
  title?: string;
  title_ar?: string;
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
  disabled?: boolean;
  type?: "primary" | "secondary" | "tertiary" | "text-link" | "delete";
  buttonType?: "button" | "submit" | "reset";
  onPress?: () => void;
  iconColor?: string;
  tooltip?: {
    text: string;
    text_ar?: string;
    language?: "en" | "ar";
    direction?:
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
      | "right-bottom"
      | "none";
  };
}

export const Buttons = ({
  language = "en",
  title_ar,
  size = "m",
  fullWidth,
  title,
  leftIcon,
  rightIcon,
  disabled = false,
  type = "primary",
  onPress = () => null,
  iconColor,
}: //   tooltip,
NewButtonProps) => {
  //   const [isTooltipVisible, setTooltipVisible] = useState(false);

  const sizeClasses = {
    s: `text-xs min-w-[87px] ${
      fullWidth ? "w-full" : ""
    } !h-[24px] px-m py-xxs`,
    m: `text-m min-w-[106px] ${
      fullWidth ? "w-full" : ""
    } !h-[28px] px-m py-xxs gap-xs`,
    l: `text-l min-w-[140px] ${
      fullWidth ? "w-full" : ""
    } !h-[40px] px-l py-xs gap-xs`,
  };

  const backgroundColorClasses = {
    primary: disabled
      ? "bg-button-primary-disabled cursor-not-allowed"
      : "bg-button-primary-default-bg",
    secondary: disabled
      ? "border border-text-dimmed cursor-not-allowed"
      : "border border-button-primary-default-bg",
    tertiary: disabled
      ? "bg-button-tertiary-disabled-bg cursor-not-allowed"
      : "bg-button-tertiary-default-bg",
    "text-link": disabled ? "cursor-not-allowed" : "text-text-link",
    delete: disabled
      ? "border border-text-dimmed cursor-not-allowed"
      : "border border-button-delete-stroke",
  };

  const textColorClasses = {
    primary: disabled ? "text-text-dimmed" : "text-button-primary-default-text",
    secondary: disabled ? "text-text-dimmed" : "text-text-link",
    tertiary: disabled
      ? "text-text-dimmed"
      : "text-button-tertiary-default-text",
    "text-link": disabled ? "text-text-dimmed" : "text-text-link",
    delete: disabled ? "text-text-dimmed" : "text-button-delete-stroke",
  };

  const renderIcon = (icon: ReactElement | undefined) => {
    if (!icon) return null;
    if (iconColor) {
      return cloneElement(icon as ReactElement<{ fill?: string }>, {
        fill: iconColor,
      });
    }
    return icon;
  };

  return (
    <View className="relative flex items-center justify-center">
      <TouchableOpacity
        // onPress={() => {
        //   onPress();
        //   if (tooltip) setTooltipVisible(!isTooltipVisible);
        // }}
        onPress={onPress}
        disabled={disabled}
        className={`flex flex-row items-center justify-center rounded-xl ${sizeClasses[size]} ${backgroundColorClasses[type]}`}
      >
        {leftIcon && <View className="mr-2">{renderIcon(leftIcon)}</View>}

        <Text className={`${leftIcon || rightIcon ? "mx-1" : ""}`}>
          <SharedLanguageSwitchRenderer
            language={language}
            value={title}
            value_ar={title_ar ?? ""}
            className={textColorClasses[type]}
          />
        </Text>

        {rightIcon && <View className="ml-2">{renderIcon(rightIcon)}</View>}
      </TouchableOpacity>

      {/* {tooltip && isTooltipVisible && (
        <View className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-20">
          <Tooltip
            text={tooltip.text}
            text_ar={tooltip.text_ar}
            language={tooltip.language || language}
            direction={tooltip.direction || "none"}
          />
        </View>
      )} */}
    </View>
  );
};
