import React from "react";
import { View, useWindowDimensions } from "react-native";
import { Text } from "~/src/ui/Text";
import { Buttons } from "~/src/ui/Buttons";
import SharedLanguageSwitchRenderer from "~/components/shared/SharedLanguageSwitchRenderer";
import type { TitleBarProps, ButtonType } from "@shared/types";
export type { TitleBarProps, ButtonType };

const TitleBar: React.FC<TitleBarProps> = ({
  title,
  title_ar,
  showTitle = true,
  acronym,
  showAcronym = true,
  showButton = false,
  buttonLabel = "Primary CTA",
  buttonLabel_ar,
  buttonType = "primary",
  leftIcon,
  rightIcon,
  onClick,
  language = "en",
}) => {
  const { width } = useWindowDimensions();

  const computedAcronym = acronym
    ? acronym.slice(0, 3).toUpperCase()
    : title
    ? title.slice(0, 3).toUpperCase()
    : "XXX";

  const isWide = width >= 768;
  const flexDirection = isWide
    ? language === "ar"
      ? "row-reverse"
      : "row"
    : "column-reverse";

  return (
    <View
      className="flex gap-xl items-center justify-between w-full"
      style={{ flexDirection }}
    >
      <View className="flex flex-row items-center gap-s md:gap-xl min-w-0 self-start">
        {showAcronym && computedAcronym && (
          <View className="rounded-s h-10 w-10 flex justify-center items-center bg-structure-primary-7">
            <Text className="text-heading-h4 font-bold text-structure-primary-4">
              {computedAcronym}
            </Text>
          </View>
        )}
        {showTitle && title && (
          <View className="flex-1">
            <SharedLanguageSwitchRenderer
              language={language}
              value={title}
              value_ar={title_ar}
              className="text-heading-h3 font-bold text-text-default capitalize"
            />
          </View>
        )}
      </View>
      {showButton && (
        <View className="flex flex-row items-center gap-xs self-end md:self-center">
          <Buttons
            title={buttonLabel}
            title_ar={buttonLabel_ar}
            language={language}
            type={buttonType}
            size="m"
            onClick={onClick}
            leftIcon={leftIcon}
            rightIcon={rightIcon}
          />
        </View>
      )}
    </View>
  );
};

export default TitleBar;
