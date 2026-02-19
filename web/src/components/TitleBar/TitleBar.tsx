import type { TitleBarProps } from "@shared/types";
import React, { useEffect, useState } from "react";
import { Buttons } from "../../ui/Buttons";
import SharedLanguageSwitchRenderer from "../shared/SharedLanguageSwitchRenderer";

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
  const [responsiveButtonSize, setButtonSize] = useState<"s" | "m" | "l">("s");

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      if (width >= 768) setButtonSize("l");
      else if (width >= 640) setButtonSize("m");
      else setButtonSize("s");
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const computedAcronym = acronym
    ? acronym.slice(0, 3).toUpperCase()
    : title
      ? title.slice(0, 3).toUpperCase()
      : "XXX";

  return (
    <div
      className="flex flex-col-reverse md:flex-row gap-xl md:gap-none items-center justify-between w-full"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="flex items-center gap-[12px] md:gap-[32px] min-w-0 self-start">
        {showAcronym && computedAcronym && (
          <div className="!rounded-[7px] sm:!rounded-[10px] md:!rounded-[12px] !h-[30px] sm:!h-[40px] !w-[30px] sm:!w-[40px] md:!h-[64px] md:!w-[64px] flex justify-center items-center bg-structure-primary-7">
            <p className="!text-10 sm:!text-16 md:!text-24 font-bold text-structure-primary-4">
              {computedAcronym}
            </p>
          </div>
        )}
        {showTitle && (title || title_ar) && (
          <h1 className="text-2xl sm:text-5xl font-bold text-text-default capitalize">
            <SharedLanguageSwitchRenderer
              language={language}
              value={title}
              value_ar={title_ar}
            />
          </h1>
        )}
      </div>
      {showButton && (
        <div className="flex items-center gap-xs self-end md:self-center">
          <Buttons
            theme={theme}
            title={buttonLabel}
            title_ar={buttonLabel_ar}
            language={language}
            type={buttonType}
            size={responsiveButtonSize}
            onClick={onClick}
          />
        </div>
      )}
    </div>
  );
};
