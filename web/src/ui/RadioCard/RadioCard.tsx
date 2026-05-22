import type { RadioCardProps } from "@shared/types";
import React from "react";
import SharedLanguageSwitchRenderer from "@/components/shared/SharedLanguageSwitchRenderer";

export type { RadioCardProps };

export const RadioCard: React.FC<RadioCardProps> = ({
  icon,
  label = "",
  label_ar,
  theme,
  iconLocation = "left",
  language = "en",
  disabled = false,
  clicked = false,
  id,
  onClick,
}) => {
  // Background color logic
  const getBackgroundColor = () => {
    {
      if (disabled) return "bg-button-radio-card-selected-disabled";
      if (clicked) return "bg-button-radio-card-selected-disabled";
      return "bg-button-radio-card-selected-disabled hover:bg-button-radio-card-default hover:opacity-100 opacity-40";
    }
  };

  // Text color logic
  const getTextColor = () => {
    if (disabled) return "text-text-dimmed";
    return "text-text-default";
  };

  // Direction classes
  const getDirectionClass = () => {
    switch (iconLocation) {
      case "top":
        return "flex-col";
      case "right":
        return "flex-row-reverse";
      case "bottom":
        return "flex-col-reverse";
      case "left":
      default:
        return "flex-row";
    }
  };

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick(id);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      data-clicked={clicked ? "true" : "false"}
      data-theme={theme || "light"}
      className={`${getBackgroundColor()} min-h-[83px] flex items-center gap-none rounded-xs px-l py-s flex-1 transition-colors ${
        disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"
      }`}
    >
      <div
        className={`flex items-center gap-xxs w-full ${getDirectionClass()}`}
      >
        <div style={{ opacity: disabled ? 0.5 : 1 }}>{icon}</div>
        <span className={`${getTextColor()} text-bold-ml`}>
          <SharedLanguageSwitchRenderer
            language={language}
            value={label}
            value_ar={label_ar}
          />
        </span>
      </div>
    </button>
  );
};
