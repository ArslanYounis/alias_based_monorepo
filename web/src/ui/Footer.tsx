import { Bot } from "./Bot";
import { Logo } from "./Logo";
import React, { useState } from "react";
import PullyUpIconSvg from "@/assets/svg/PullyUp";
import PullyDownIconSvg from "@/assets/svg/PullyDown";

interface FooterProps {
  showLogo?: boolean;
  logoType?: "full" | "icon" | "hub";
  logoClassName?: string;
  logoWidth?: number | string;
  logoHeight?: number | string;
  showBot?: boolean;
  language?: "en" | "ar";
  botMessage?: string;
  botMessage_ar?: string;
  botStatus?: "close" | "open";
  botClassName?: string;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

export const Footer = ({
  showLogo = true,
  logoType = "full",
  logoClassName = "",
  logoWidth,
  logoHeight,
  showBot = true,
  language = "en",
  botMessage = "Hello! How can I help you today?",
  botMessage_ar = "مرحبا! كيف يمكنني مساعدتك اليوم؟",
  // botStatus = "open",
  botClassName = "",
}: FooterProps) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [botStatus, setBotStatus] = useState<"open" | "close">("close");
  return (
    <div className="flex items-center justify-between p-m h-[98px]">
      <div className="!hidden sm:!flex items-center space-x-4">
        {showLogo && (
          <Logo
            type={logoType}
            className={logoClassName}
            width={logoWidth}
            height={logoHeight}
          />
        )}
      </div>
      <div className="!hidden sm:!flex">
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
      </div>
      <div className="sm:!hidden !flex flex-col items-center w-full">
        <div onClick={() => setOpen(!open)} className="cursor-pointer mb-2">
          {open ? <PullyUpIconSvg /> : <PullyDownIconSvg />}
        </div>
        {open && (
          <div className="flex items-center justify-between w-full">
            <div className="h-12 w-12">
              {showLogo && (
                <Logo
                  type={isMobile ? "icon" : logoType}
                  className={logoClassName}
                  width={isMobile ? 60 : logoWidth}
                  height={isMobile ? 60 : logoHeight}
                />
              )}
            </div>
            <div>
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
