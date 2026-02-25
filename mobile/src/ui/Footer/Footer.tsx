import type { FooterProps } from "@shared/types";
import React, { useState } from "react";
import { View, Pressable, useWindowDimensions } from "react-native";

import { Bot } from "../Bot";
import { Logo } from "../Logo";
import PullyUp from "~/assets/svg/icons/PullyUp";
import PullyDown from "~/assets/svg/icons/PullyDown";

export type { FooterProps };

const BREAKPOINT_SM = 640;

function useIsMobile() {
  const { width } = useWindowDimensions();
  return width < BREAKPOINT_SM;
}

export const Footer: React.FC<FooterProps> = ({
  showLogo = true,
  logoType = "full",
  logoClassName = "",
  logoWidth,
  logoHeight,
  showBot = true,
  language = "en",
  botMessage = "Hello! How can I help you today?",
  botMessage_ar = "مرحبا! كيف يمكنني مساعدتك اليوم؟",
  botClassName = "",
}) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [botStatus, setBotStatus] = useState<"open" | "close">("close");

  return (
    <View className="flex flex-row items-center justify-between p-m min-h-[98px]">
      {/* Desktop: Logo left, Bot right (same as web sm and up) */}
      {!isMobile && (
        <>
          <View className="flex flex-row items-center gap-4">
            {showLogo && (
              <Logo
                type={logoType}
                className={logoClassName}
                width={logoWidth}
                height={logoHeight}
              />
            )}
          </View>
          <View>
            {showBot && (
              <Bot
                language={language}
                message={botMessage}
                message_ar={botMessage_ar}
                status={botStatus}
                className={botClassName}
                onClick={(newStatus) => setBotStatus(newStatus)}
              />
            )}
          </View>
        </>
      )}

      {/* Mobile: pully + expandable row (same as web below sm) */}
      {isMobile && (
        <View className="flex flex-col items-center w-full">
          <Pressable onPress={() => setOpen(!open)} className="mb-2">
            {open ? <PullyUp /> : <PullyDown />}
          </Pressable>
          {open && (
            <View className="flex flex-row justify-between items-center w-full">
              <View className="w-12 h-12">
                {showLogo && (
                  <Logo
                    type="icon"
                    className={logoClassName}
                    width={60}
                    height={60}
                  />
                )}
              </View>
              <View>
                {showBot && (
                  <Bot
                    language={language}
                    message={botMessage}
                    message_ar={botMessage_ar}
                    status={botStatus}
                    className={botClassName}
                    onClick={(newStatus) => setBotStatus(newStatus)}
                  />
                )}
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
};
