import React, { useState, useEffect } from "react";
import SharedLanguageSwitchRenderer from "@/components/shared/SharedLanguageSwitchRenderer";

interface BotProps {
  language?: "en" | "ar";
  message_ar?: string;
  message?: string;
  status?: "close" | "open";
  className?: string;
  onClick?: (newStatus: "open" | "close") => void;
}

export const Bot: React.FC<BotProps> = ({
  message = "Hello! How can I help you today?",
  status = "close",
  language = "en",
  message_ar = "مرحبا! كيف يمكنني مساعدتك اليوم؟",
  className = "",
  onClick,
}) => {
  const [currentStatus, setCurrentStatus] = useState<"open" | "close">(status);

  // Sync internal state with status prop changes
  useEffect(() => {
    setCurrentStatus(status);
  }, [status]);

  const handleClick = () => {
    const newStatus = currentStatus === "open" ? "close" : "open";
    setCurrentStatus(newStatus);
    if (onClick) onClick(newStatus);
  };

  return (
    <div
      data-testid="bot-container"
      className={`flex items-start cursor-pointer relative ${className}`}
      onClick={handleClick}
    >
      <div
        className="flex flex-col items-end space-y-2"
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <>
          {currentStatus === "open" && message.length > 0 && (
            <div
              className={`absolute z-30 bottom-[70px] bg-structure-primary-0 text-text-default text-base px-6 py-4 font-normal rounded-lg min-w-[420px] rounded-bl-none mb-0.5 ${
                language === "ar" ? "text-start" : ""
              }`}
              style={{
                boxShadow: "-4px 10px 24px 0px #0000001A",
              }}
            >
              <SharedLanguageSwitchRenderer
                language={language}
                value={message}
                value_ar={message_ar}
              />
              <div
                className={`absolute -bottom-6 text-structure-primary-0 ${
                  language === "en" ? "right-16" : "left-16"
                }  w-0 h-0 border-t-[24px] border-t-structure-primary-0 border-l-[24px] border-l-transparent transform ${
                  language === "en" ? "rotate-360" : "rotate-270"
                }`}
              ></div>
            </div>
          )}
          <img
            alt="Profile picture of a person wearing a hijab"
            className={`w-[64px] h-[64px] rounded-full ${
              language === "en" ? "mr-[20px]" : "ml-[20px]"
            } z-40`}
            src="https://adrec-images.mastermind-mindset.com/footerAvatar.svg"
          />
        </>
      </div>
    </div>
  );
};
