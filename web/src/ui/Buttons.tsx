import { Tooltip } from "./Tooltip";
import { type ReactElement, useState, cloneElement } from "react";
import SharedLanguageSwitchRenderer from "../components/shared/SharedLanguageSwitchRenderer";

export interface NewButtonProps {
  language?: "en" | "ar";
  size?: "s" | "m" | "l";
  fullWidth?: boolean;
  title?: string;
  title_ar?: string;
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
  disabled?: boolean;
  type?: "primary" | "secondary" | "tertiary" | "text-link" | "delete"; // help removed
  buttonType?: "button" | "submit" | "reset";
  onClick?: () => void;
  iconColor?: string;
  tooltip?: {
    text: string;
    text_ar?: string;
    language?: "en" | "ar";
    direction?:
      | "top-left"
      | "top-center"
      | "top-right"
      | "bottom-left"
      | "bottom-center"
      | "bottom-right"
      | "left-top"
      | "left-center"
      | "left-bottom"
      | "right-top"
      | "right-center"
      | "right-bottom"
      | "none";
  };
}

export const Buttons = ({
  language = "en",
  title_ar,
  size = "m",
  fullWidth,
  title,
  leftIcon,
  rightIcon,
  disabled = false,
  type = "primary",
  buttonType = "button",
  onClick = () => null,
  iconColor,
  tooltip,
}: NewButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isTooltipHovered, setIsTooltipHovered] = useState(false);

  const sizeClasses = {
    s: {
      button: `text-xs min-w-[87px] ${
        fullWidth ? "w-full" : ""
      } !h-[24px] px-m py-xxs`,
      icon: "h-[12px] w-[12px] m-0",
    },
    m: {
      button: `text-m min-w-[106px] ${
        fullWidth ? "w-full" : ""
      } !h-[28px] px-m py-xxs gap-xs`,
      icon: "h-[15px] w-[15px] m-0",
    },
    l: {
      button: `text-l min-w-[140px] ${
        fullWidth ? "w-full" : ""
      } !h-[40px] px-l py-xs gap-xs`,
      icon: "h-[18px] w-[18px] m-0",
    },
  };

  const currentSize = sizeClasses[size];

  const typeStyles = {
    primary: {
      default:
        "bg-button-primary-default-bg text-button-primary-default-text cursor-pointer",
      hover:
        "bg-button-primary-hover text-button-primary-default-text cursor-pointer",
      disabled:
        "bg-button-primary-disabled text-text-dimmed cursor-not-allowed",
    },
    secondary: {
      default:
        "border border-button-primary-default-bg text-text-link cursor-pointer",
      hover:
        "border border-button-primary-default-bg text-text-link bg-button-secondary-hover-bg cursor-pointer",
      disabled: "border border-text-dimmed text-text-dimmed cursor-not-allowed",
    },
    tertiary: {
      default:
        "bg-button-tertiary-default-bg text-button-tertiary-default-text cursor-pointer",
      hover:
        "bg-button-tertiary-hover text-button-tertiary-default-text cursor-pointer",
      disabled:
        "bg-button-tertiary-disabled-bg text-text-dimmed cursor-not-allowed",
    },
    "text-link": {
      default: "text-text-link cursor-pointer",
      hover: "text-text-link-hover cursor-pointer",
      disabled: "text-text-dimmed cursor-not-allowed",
    },
    delete: {
      default:
        "border border-button-delete-stroke text-button-delete-stroke cursor-pointer",
      hover:
        "border border-button-delete-stroke bg-button-delete-hover-bg text-status-failed-solid cursor-pointer",
      disabled: "border border-text-dimmed text-text-dimmed cursor-not-allowed",
    },
  };

  const currentTypeStyles =
    typeStyles[type][disabled ? "disabled" : isHovered ? "hover" : "default"];

  const renderIcon = (icon: ReactElement | undefined) => {
    if (!icon) return null;
    if (iconColor) {
      return cloneElement(icon as ReactElement<{ fill?: string }>, {
        fill: iconColor,
      });
    }
    return icon;
  };

  const showTooltip = tooltip && (isHovered || isTooltipHovered);

  // For other types with tooltip, use the original wrapper approach
  if (tooltip) {
    return (
      <div
        className="flex items-center justify-center gap-4 relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ zIndex: 20 }}
      >
        <button
          type={buttonType}
          onClick={onClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          disabled={disabled}
          className={`flex items-center justify-center rounded-xl cursor-pointer`}
        >
          {leftIcon && (
            <span className={`${currentSize.icon}`}>
              {renderIcon(leftIcon)}
            </span>
          )}
          <p className={`${leftIcon || rightIcon ? "gap-xxs" : ""}`}>
            <SharedLanguageSwitchRenderer
              language={language}
              value={title}
              value_ar={title_ar ?? ""}
            />
          </p>
          {rightIcon && (
            <span className={`${currentSize.icon}`}>
              {renderIcon(rightIcon)}
            </span>
          )}
        </button>
        {showTooltip && (
          <div
            className="absolute left-full ml-2 top-1/2 -translate-y-1/2"
            onMouseEnter={() => setIsTooltipHovered(true)}
            onMouseLeave={() => setIsTooltipHovered(false)}
          >
            <Tooltip
              text={tooltip.text}
              text_ar={tooltip.text_ar}
              language={tooltip.language || language}
              direction={"left-center"}
            />
          </div>
        )}
      </div>
    );
  }

  // Default button without tooltip
  return (
    <button
      type={buttonType}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled}
      className={`flex items-center justify-center shrink-0 rounded-xxl ${currentSize.button} ${currentTypeStyles}`}
    >
      {leftIcon && (
        <span className={`${currentSize.icon}`}>{renderIcon(leftIcon)}</span>
      )}
      <p className={`${leftIcon || rightIcon ? "gap-xxs" : ""}`}>
        <SharedLanguageSwitchRenderer
          language={language}
          value={title}
          value_ar={title_ar ?? ""}
        />
      </p>
      {rightIcon && (
        <span className={`${currentSize.icon}`}>{renderIcon(rightIcon)}</span>
      )}
    </button>
  );
};
