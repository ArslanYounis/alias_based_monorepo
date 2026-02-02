import React from "react";
import SharedLanguageSwitchRenderer from "@/components/shared/SharedLanguageSwitchRenderer";

interface CaptionProps {
  captionLeft?: string;
  captionLeft_ar?: string;
  captionRight?: string;
  captionRight_ar?: string;
  hasError?: boolean;
  disabled?: boolean;
  errorMessage?: string;
  errorMessage_ar?: string;
  language?: "en" | "ar";
}

export const Caption: React.FC<CaptionProps> = ({
  captionLeft = "Caption Left",
  captionLeft_ar = "التسمية على اليسار",
  captionRight = "Caption Right",
  captionRight_ar = "التسمية على اليمين",
  hasError = false,
  disabled = false,
  errorMessage,
  errorMessage_ar,
  language = "en",
}) => {
  const textColor = disabled
    ? "text-text-dimmed"
    : "text-form-fields-captions-text-color";

  return (
    <div className="flex flex-col">
      {/* Show captions only if there are any captions to display */}
      {(captionLeft || captionLeft_ar || captionRight || captionRight_ar) && (
        <div
          className={`text-bold-xs flex ${
            language === "en" ? "flex-row" : "flex-row-reverse"
          } justify-between items-center ${textColor} min-h-[16px]`}
          style={{ direction: language === "en" ? "ltr" : "rtl" }}
        >
          <span
            className={`flex-1 ${
              language === "en" ? "text-start" : "text-end"
            }`}
          >
            <SharedLanguageSwitchRenderer
              language={language}
              value={captionLeft || ""}
              value_ar={captionLeft_ar}
            />
          </span>
          <span
            className={`flex-1 ${
              language === "en" ? "text-end" : "text-start"
            }`}
          >
            <SharedLanguageSwitchRenderer
              language={language}
              value={captionRight || ""}
              value_ar={captionRight_ar || ""}
            />
          </span>
        </div>
      )}

      {!disabled && hasError && (errorMessage || errorMessage_ar) && (
        <span
          className={`text-xs text-form-fields-error  ${
            language === "en" ? "text-start" : "text-end"
          }`}
        >
          <SharedLanguageSwitchRenderer
            language={language}
            value={errorMessage || ""}
            value_ar={errorMessage_ar || ""}
          />
        </span>
      )}
    </div>
  );
};
