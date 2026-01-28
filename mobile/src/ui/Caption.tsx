import React from "react";
import { Text, View } from "react-native";
import SharedLanguageSwitchRenderer from "~/components/shared/SharedLanguageSwitchRenderer";

interface CaptionProps {
  captionLeft?: string;
  captionLeft_ar?: string;
  captionRight?: string;
  captionRight_ar?: string;
  hasError?: boolean;
  disabled?: boolean;
  errorMessage?: string;
  errorMessage_ar?: string;
  language?: "en" | "ar";
}

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
  const isEnglish = language === "en";

  const textColor = disabled
    ? "text-text-dimmed"
    : "text-form-fields-captions-text-color";

  return (
    <View className="flex flex-col">
      {(captionLeft || captionLeft_ar || captionRight || captionRight_ar) && (
        <View
          className={`flex ${
            isEnglish ? "flex-row" : "flex-row-reverse"
          } justify-between items-center text-bold-xs ${textColor}`}
          style={{ minHeight: 16 }}
        >
          <View>
            <SharedLanguageSwitchRenderer
              language={language}
              value={captionLeft || ""}
              value_ar={captionLeft_ar}
            />
          </View>

          <View>
            <SharedLanguageSwitchRenderer
              language={language}
              value={captionRight || ""}
              value_ar={captionRight_ar || ""}
            />
          </View>
        </View>
      )}

      {!disabled && hasError && (errorMessage || errorMessage_ar) && (
        <View>
          <SharedLanguageSwitchRenderer
            language={language}
            value={errorMessage || ""}
            value_ar={errorMessage_ar || ""}
            className="text-xs text-form-fields-error"
          />
        </View>
      )}
    </View>
  );
};
