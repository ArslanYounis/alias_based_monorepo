import type { FooterProps } from "@shared/types";
import React, { useState } from "react";
import { View, Pressable } from "react-native";

import { Bot } from "../Bot";
import { Logo } from "../Logo";
import PullyUp from "~/assets/svg/icons/PullyUp";
import PullyDown from "~/assets/svg/icons/PullyDown";

export type { FooterProps };

export const Footer = ({
  showLogo = true,
  logoType = "full",
  logoWidth = 120,
  logoHeight = 40,
  logoClassName,
  showBot = true,
  language = "en",
  botMessage = "Hello! How can I help you today?",
  botMessage_ar = "مرحبا! كيف يمكنني مساعدتك اليوم؟",
  botClassName,
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
            {showLogo && <Logo type="icon" width={48} height={48} className={logoClassName} />}

            {showBot && (
              <Bot
                language={language}
                message={botMessage}
                message_ar={botMessage_ar}
                status={botStatus}
                onClick={setBotStatus}
              />
            )}
          </View>
        )}
      </View>
    </View>
  );
};
