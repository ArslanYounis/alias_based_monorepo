import React from "react";
import { TextProps } from "react-native";
import { Text } from "~/src/ui/Text";

interface SharedLanguageSwitchRendererProps extends TextProps {
  language: "en" | "ar";
  value?: string;
  value_ar?: string;
  className?: string;
}

const SharedLanguageSwitchRenderer: React.FC<
  SharedLanguageSwitchRendererProps
> = ({ language, value, value_ar, className, style, ...textProps }) => {
  const displayValue = language === "en" ? value : value_ar || value;

  if (!displayValue) return null;

  return (
    <Text className={className} style={[{ textAlign: "left" }, style]} {...textProps}>
      {displayValue}
    </Text>
  );
};

export default SharedLanguageSwitchRenderer;
