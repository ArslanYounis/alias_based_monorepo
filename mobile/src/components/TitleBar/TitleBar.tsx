import type { TitleBarProps } from "@shared/types";
import React from "react";
import { View, Text } from "react-native";
import { useWindowDimensions } from "react-native";
import { Buttons } from "../../ui/Buttons";
import SharedLanguageSwitchRenderer from "~/components/shared/SharedLanguageSwitchRenderer";

export type { TitleBarProps };

export const TitleBar: React.FC<TitleBarProps> = ({
  title,
  title_ar,
  showTitle = true,
  acronym,
  showAcronym = true,
  showButton = false,
  buttonLabel = "Primary CTA",
  buttonLabel_ar,
  buttonType = "primary",
  onClick,
  theme = "light",
  language = "en",
}) => {
  const { width } = useWindowDimensions();
  const buttonSize = width >= 768 ? "l" : width >= 640 ? "m" : "s";
  const computedAcronym = acronym
    ? acronym.slice(0, 3).toUpperCase()
    : title
      ? title.slice(0, 3).toUpperCase()
      : "XXX";

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        {showAcronym && computedAcronym && (
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: "#e5e7eb",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "700", color: "#374151" }}>
              {computedAcronym}
            </Text>
          </View>
        )}
        {showTitle && (title || title_ar) && (
          <Text style={{ fontSize: 24, fontWeight: "700" }}>
            <SharedLanguageSwitchRenderer
              language={language}
              value={title}
              value_ar={title_ar}
            />
          </Text>
        )}
      </View>
      {showButton && (
        <Buttons
          theme={theme}
          title={buttonLabel}
          title_ar={buttonLabel_ar}
          language={language}
          type={buttonType}
          size={buttonSize}
          onClick={onClick}
        />
      )}
    </View>
  );
};
