import React, { useState, useEffect } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import SharedLanguageSwitchRenderer from "~/components/shared/SharedLanguageSwitchRenderer";

interface BotProps {
  language?: "en" | "ar";
  message_ar?: string;
  message?: string;
  status?: "close" | "open";
  onPress?: (newStatus: "open" | "close") => void;
}

export const Bot: React.FC<BotProps> = ({
  message = "Hello! How can I help you today?",
  status = "close",
  language = "en",
  message_ar = "مرحبا! كيف يمكنني مساعدتك اليوم؟",
  onPress,
}) => {
  const [currentStatus, setCurrentStatus] = useState<"open" | "close">(status);

  useEffect(() => {
    setCurrentStatus(status);
  }, [status]);

  const handleClick = () => {
    const newStatus = currentStatus === "open" ? "close" : "open";
    setCurrentStatus(newStatus);
    onPress?.(newStatus);
  };

  const isRTL = language === "ar";

  return (
    <TouchableOpacity
      onPress={handleClick}
      activeOpacity={0.8}
      className={`flex items-start relative ${
        isRTL ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {currentStatus === "open" && message.length > 0 && (
        <View
          className={`absolute bottom-18 bg-structure-primary-0 px-6 py-4 rounded-lg rounded-bl-none shadow-lg z-30 ${
            isRTL ? "text-right" : "text-left"
          } min-w-[320px]`}
        >
          <SharedLanguageSwitchRenderer
            language={language}
            value={message}
            value_ar={message_ar}
          />

          {/* Triangle arrow */}
          <View
            className={`absolute -bottom-6 w-0 h-0 border-t-[24px] border-t-structure-primary-0 border-l-[24px] border-l-transparent ${
              isRTL ? "left-16 -rotate-90" : "right-16 rotate-0"
            }`}
          />
        </View>
      )}

      <Image
        source={{
          uri: "https://adrec-images.mastermind-mindset.com/footerAvatar.svg",
        }}
        className={`w-16 h-16 rounded-full z-40 ${isRTL ? "ml-5" : "mr-5"}`}
      />
    </TouchableOpacity>
  );
};
