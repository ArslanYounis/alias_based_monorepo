import React, { ReactElement } from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { Buttons } from "~/src/ui/Buttons";
import SharedLanguageSwitchRenderer from "~/components/shared/SharedLanguageSwitchRenderer";

export type ButtonType =
  | "primary"
  | "secondary"
  | "tertiary"
  | "text-link"
  | "delete";

export interface TitleBarProps {
  title?: string;
  title_ar?: string;
  showTitle?: boolean;
  acronym?: string;
  acronym_ar?: string;
  acronymBGColor?: string;
  showAcronym?: boolean;
  showButton?: boolean;
  buttonLabel?: string;
  buttonLabel_ar?: string;
  buttonType?: ButtonType;
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
  onClick?: () => void;
  language?: "en" | "ar";
}

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
          <View>
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
