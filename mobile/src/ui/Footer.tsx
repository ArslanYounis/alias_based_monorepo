import React, { useState } from "react";
import { View, Pressable } from "react-native";

import { Bot } from "./Bot";
import { Logo } from "./Logo";
import PullyUp from "~/assets/svg/icons/PullyUp";
import PullyDown from "~/assets/svg/icons/PullyDown";

interface FooterProps {
  showLogo?: boolean;
  logoType?: "full" | "icon" | "hub";
  logoWidth?: number;
  logoHeight?: number;
  showBot?: boolean;
  language?: "en" | "ar";
  botMessage?: string;
  botMessage_ar?: string;
}

export const Footer = ({
  showLogo = true,
  logoType = "full",
  logoWidth = 120,
  logoHeight = 40,
  showBot = true,
  language = "en",
  botMessage = "Hello! How can I help you today?",
  botMessage_ar = "مرحبا! كيف يمكنني مساعدتك اليوم؟",
}: FooterProps) => {
  const [open, setOpen] = useState(false);
  const [botStatus, setBotStatus] = useState<"open" | "close">("close");

  return (
    <View className="w-full bg-white">
      <View className="w-full items-center p-2">
        <Pressable onPress={() => setOpen(!open)} className="mb-2">
          {open ? <PullyUp /> : <PullyDown />}
        </Pressable>

        {open && (
          <View className="w-full flex-row justify-between items-center px-2">
            {showLogo && <Logo type="icon" width={48} height={48} />}

            {showBot && (
              <Bot
                language={language}
                message={botMessage}
                message_ar={botMessage_ar}
                status={botStatus}
                onPress={setBotStatus}
              />
            )}
          </View>
        )}
      </View>
    </View>
  );
};
