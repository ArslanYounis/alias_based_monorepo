import type { LabelProps } from "@shared/types";
import React from "react";
import { View, Pressable, Text } from "react-native";
import SharedLanguageSwitchRenderer from "~/components/shared/SharedLanguageSwitchRenderer";
import InfoIcon from "~/assets/svg/icons/Info";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
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
        <Text className="text-form-fields-error text-xs">
          <SharedLanguageSwitchRenderer language={language} value="*" />
        </Text>
      )}

      {showInfoIcon && (
        <Popover>
          <PopoverTrigger asChild disabled={disabled}>
            <Pressable
              className="flex items-center justify-center"
              style={({ pressed }) => ({
                opacity: disabled ? 1 : pressed ? 0.7 : 1,
              })}
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
          </PopoverTrigger>
          <PopoverContent
            align="start"
            side="top"
            sideOffset={8}
            className="w-fit border-none p-0"
          >
            {/* TODO: Tooltip in mobile may need to be updated (styling/behavior for popover context). */}
            <Tooltip
              text={
                language === "en" ? tooltipText : tooltipText_ar || tooltipText
              }
              direction={
                tooltipDirection ??
                (language === "en" ? "top-left" : "top-right")
              }
            />
          </PopoverContent>
        </Popover>
      )}
    </View>
  );
};
