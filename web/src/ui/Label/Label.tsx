import type { LabelProps } from "@shared/types";
import React, { useState } from "react";
import InfoSVG from "@/assets/svg/InfoSVG";
import SharedLanguageSwitchRenderer from "@/components/shared/SharedLanguageSwitchRenderer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tooltip } from "../Tooltip";

export type { LabelProps };

export const Label: React.FC<LabelProps> = ({
  label,
  label_ar,
  required = false,
  showInfoIcon = false,
  tooltipText = "This is additional info",
  tooltipText_ar,
  tooltipDirection,
  disabled = false,
  language = "en",
  htmlFor,
}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  return (
    <label
      htmlFor={htmlFor}
      className={`flex items-center text-bold-xs gap-xxs text-form-fields-label-text`}
      style={{ direction: language === "en" ? "ltr" : "rtl" }}
    >
      <SharedLanguageSwitchRenderer
        language={language}
        value={label}
        value_ar={label_ar}
      />
      {required && <span className="text-form-fields-error text-xs">*</span>}

      {showInfoIcon && (
        <div className="relative flex gap-4 items-center">
          <Popover open={isTooltipVisible} onOpenChange={setIsTooltipVisible}>
            <PopoverTrigger asChild>
              <div
                onMouseEnter={() => !disabled && setIsTooltipVisible(true)}
                onMouseLeave={() => setIsTooltipVisible(false)}
                onFocus={() => !disabled && setIsTooltipVisible(true)}
                onBlur={() => setIsTooltipVisible(false)}
                className={`inline-flex items-center`}
              >
                <InfoSVG
                  className={`w-[14px] h-[14px] ${
                    disabled
                      ? "text-form-fields-label-disabled"
                      : "text-form-fields-label-icon"
                  } cursor-pointer`}
                />
              </div>
            </PopoverTrigger>

            <PopoverContent
              portaled={false}
              align="start"
              sideOffset={8}
              className="w-fit p-0 border-none"
              style={{ zIndex: 999999 }}
            >
              <Tooltip
                text={
                  language === "en"
                    ? tooltipText
                    : tooltipText_ar || tooltipText
                }
                direction={
                  tooltipDirection || language === "en"
                    ? "top-left"
                    : "top-right"
                }
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
    </label>
  );
};
