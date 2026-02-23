import type { FooterProps } from "@shared/types";
import React, { useState } from "react";
import { Bot } from "../Bot";
import { Logo } from "../Logo";
import PullyUpIconSvg from "@/assets/svg/PullyUp";
import PullyDownIconSvg from "@/assets/svg/PullyDown";

export type { FooterProps };

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
    <footer className="flex items-center justify-between p-4 h-[98px]" role="contentinfo">
      <div className="!hidden sm:!flex items-center space-x-4 shrink-0">
        {showLogo && (
          <Logo
            type={logoType}
            className={logoClassName}
            width={logoWidth}
            height={logoHeight}
          />
        )}
      </div>
      <div className="!hidden sm:!flex shrink-0">
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
        <button type="button" onClick={() => setOpen(!open)} className="cursor-pointer mb-2 p-1" aria-expanded={open} aria-label={open ? "Collapse footer" : "Expand footer"}>
          {open ? <PullyUpIconSvg /> : <PullyDownIconSvg />}
        </button>
        {open && (
          <div className="flex items-center justify-between w-full">
            {showLogo && (
              <div className="h-12 w-12 shrink-0">
                <Logo
                  type={isMobile ? "icon" : logoType}
                  className={logoClassName}
                  width={isMobile ? 60 : logoWidth}
                  height={isMobile ? 60 : logoHeight}
                />
              </div>
            )}
            {showBot && (
              <div>
                <Bot
                  language={language}
                  message={botMessage}
                  message_ar={botMessage_ar}
                  status={botStatus}
                  className={botClassName}
                  onClick={(newStatus) => setBotStatus(newStatus)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </footer>
  );
};
