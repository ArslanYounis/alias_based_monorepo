import React from "react";
import { Text, TextProps } from "react-native";

interface SharedLanguageSwitchRendererProps extends TextProps {
  language: "en" | "ar";
  value?: string;
  value_ar?: string;
  className?: string;
}

const SharedLanguageSwitchRenderer: React.FC<
  SharedLanguageSwitchRendererProps
> = ({ language, value, value_ar, className, ...textProps }) => {
  const displayValue = language === "en" ? value : value_ar || value;

  if (!displayValue) return null;

  return (
    <Text className={className} {...textProps}>
      {displayValue}
    </Text>
  );
};

export default SharedLanguageSwitchRenderer;
