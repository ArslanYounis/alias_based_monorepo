import React from "react";
import type { PromptProps } from "@shared/types";
import { Buttons } from "../Buttons";
import SharedLanguageSwitchRenderer from "@/components/shared/SharedLanguageSwitchRenderer";

export type { PromptProps };

const Prompt: React.FC<PromptProps> = ({
  title,
  title_ar,
  subtiltle,
  subtiltle_ar,
  yesText = "Yes",
  yesText_ar = "نعم",
  noText = "No",
  noText_ar = "لا",
  onYesClick,
  onNoClick,
  theme = "dark",
  language = "en",
}) => {
  const isRTL = language === "ar";
  const textColor = "text-text-default";

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex flex-col gap-xl">
        <p className={`text-heading-h1 font-bold ${textColor}`}>
          <SharedLanguageSwitchRenderer
            value={title}
            value_ar={title_ar}
            language={language}
          />
        </p>
        <p className={`text-m ${textColor}`}>
          <SharedLanguageSwitchRenderer
            value={subtiltle}
            value_ar={subtiltle_ar}
            language={language}
          />
        </p>
        <div className={`flex gap-m ${isRTL ? "flex-row-reverse" : ""}`}>
          <Buttons
            title={noText}
            title_ar={noText_ar}
            onClick={onNoClick}
            type="delete"
            theme={theme}
            language={language}
          />
          <Buttons
            title={yesText}
            title_ar={yesText_ar}
            onClick={onYesClick}
            type="secondary"
            theme={theme}
            language={language}
          />
        </div>
      </div>
    </div>
  );
};

export default Prompt;
