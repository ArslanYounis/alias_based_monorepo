import type { CaptionProps } from "@shared/types";
import React from "react";
import { View } from "react-native";
import { Text } from "@platform/Text";
import SharedLanguageSwitchRenderer from "~/components/shared/SharedLanguageSwitchRenderer";

export type { CaptionProps };

export const Caption: React.FC<CaptionProps> = ({
  captionLeft = "Caption Left",
  captionLeft_ar = "التسمية على اليسار",
  captionRight = "Caption Right",
  captionRight_ar = "التسمية على اليمين",
  hasError = false,
  disabled = false,
  errorMessage,
  errorMessage_ar,
  language = "en",
}) => {
  const textColor = disabled
    ? "text-text-dimmed"
    : "text-form-fields-captions-text-color";

  const isRtl = language === "ar";

  return (
    <View className="flex flex-col">
      {(captionLeft || captionLeft_ar || captionRight || captionRight_ar) && (
        <View
          className={`text-bold-xs flex justify-between items-center ${textColor}`}
          style={{
            minHeight: 16,
            flexDirection: isRtl ? "row-reverse" : "row",
          }}
        >
          <View
            style={{ flex: 1, alignItems: isRtl ? "flex-end" : "flex-start" }}
          >
            <Text>
              <SharedLanguageSwitchRenderer
                language={language}
                value={captionLeft || ""}
                value_ar={captionLeft_ar}
              />
            </Text>
          </View>
          <View
            style={{ flex: 1, alignItems: isRtl ? "flex-start" : "flex-end" }}
          >
            <Text>
              <SharedLanguageSwitchRenderer
                language={language}
                value={captionRight || ""}
                value_ar={captionRight_ar || ""}
              />
            </Text>
          </View>
        </View>
      )}

      {!disabled && hasError && (errorMessage || errorMessage_ar) && (
        <View style={{ alignSelf: "flex-start" }}>
          <Text>
            <SharedLanguageSwitchRenderer
              language={language}
              value={errorMessage || ""}
              value_ar={errorMessage_ar || ""}
              className="text-xxs text-form-fields-error"
            />
          </Text>
        </View>
      )}
    </View>
  );
};
