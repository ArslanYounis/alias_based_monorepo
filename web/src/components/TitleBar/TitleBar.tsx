import React, { type ReactElement, useEffect, useState } from "react";
import { Buttons } from "@/ui/Buttons";
import SharedLanguageSwitchRenderer from "@/components/shared/SharedLanguageSwitchRenderer";

export type ButtonType =
  | "primary"
  | "secondary"
  | "tertiary"
  | "text-link"
  | "delete";

export interface TitleBarProps {
  title?: string;
  title_ar?: string;
  showTitle?: boolean;
  acronym?: string;
  acronym_ar?: string;
  acronymBGColor?: string;
  showAcronym?: boolean;
  showButton?: boolean;
  buttonLabel?: string;
  buttonLabel_ar?: string;
  buttonType?: ButtonType;
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
  onClick?: () => void;
  language?: "en" | "ar";
}

const sizeClasses = {
  s: {
    button: "px-m h-6 py-xxs text-xs",
    icon: "h-3 w-3 ",
  },
  m: {
    button: "px-m h-7 py-xxs text-m",
    icon: "h-[15px] w-[15px]",
  },
  l: {
    button: "px-l h-10 py-s text-l",
    icon: "h-[18px] w-[18px]",
  },
};

const TitleBar: React.FC<TitleBarProps> = ({
  title,
  title_ar,
  showTitle = true,
  acronym,
  showAcronym = true,
  showButton = false,
  buttonLabel = "Primary CTA",
  buttonLabel_ar,
  buttonType = "primary",
  leftIcon,
  rightIcon,
  onClick,
  language = "en",
}) => {
  const [responsiveButtonSize, setButtonSize] = useState<"s" | "m" | "l">("s");

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      if (width >= 768) {
        setButtonSize("l");
      } else if (width >= 640 && width < 768) {
        setButtonSize("m");
      } else {
        setButtonSize("s");
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const currentSize = sizeClasses[responsiveButtonSize];
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
      <div className="flex items-center gap-s md:gap-xl min-w-0 self-start">
        {showAcronym && computedAcronym && (
          <div className="rounded-xxs! sm:rounded-s! md:rounded-s! h-[30px]! sm:h-[40px]! w-[30px]! sm:w-[40px]! md:h-[64px]! md:w-[64px]! flex justify-center items-center bg-structure-primary-7">
            <p className="text-xxs! sm:text-heading-h4! md:text-heading-h3! font-bold text-structure-primary-4">
              {computedAcronym}
            </p>
          </div>
        )}
        {showTitle && title && (
          <h1 className="text-heading-h2 sm:text-heading-h1 font-bold text-text-default capitalize">
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
            title={buttonLabel}
            title_ar={buttonLabel_ar}
            language={language}
            type={buttonType}
            size={responsiveButtonSize}
            onClick={onClick}
            leftIcon={
              leftIcon ? (
                <span className={currentSize.icon}>{leftIcon}</span>
              ) : undefined
            }
            rightIcon={
              rightIcon ? (
                <span className={currentSize.icon}>{rightIcon}</span>
              ) : undefined
            }
          />
        </div>
      )}
    </div>
  );
};

export default TitleBar;
