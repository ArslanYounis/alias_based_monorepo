import React from "react";
import OneHubsvg from "@/assets/icons/oneHubsvg";

interface LogoProps {
  type: "full" | "icon" | "hub";
  className?: string;
  width?: number | string;
  height?: number | string;
}

export const Logo: React.FC<LogoProps> = ({
  type,
  className,
  width,
  height,
}) => {
  let defaultWidth: string | undefined;
  let defaultHeight: string | undefined;
  switch (type) {
    case "full":
      defaultWidth = "300px";
      defaultHeight = "66px";
      break;
    case "icon":
      defaultWidth = "32.54px";
      defaultHeight = "37px";
      break;
    case "hub":
      defaultWidth = "52px";
      defaultHeight = "34px";
      break;
    default:
      break;
  }
  const finalWidth = width ?? defaultWidth;
  const finalHeight = height ?? defaultHeight;
  const imgProps = {
    className,
    width: finalWidth,
    height: finalHeight,
    style: { width: finalWidth, height: finalHeight },
  };
  const renderLogo = () => {
    switch (type) {
      case "full":
        return (
          <img
            alt="DMT logo"
            src="https://adrec-images.mastermind-mindset.com/dmtLogo.svg"
            {...imgProps}
          />
        );
      case "icon":
        return (
          <img
            alt="DMT icon"
            src="https://adrec-images.mastermind-mindset.com/dmtIocn.svg"
            {...imgProps}
          />
        );
      case "hub":
        return (
          <OneHubsvg
            className={className}
            style={{ width: finalWidth, height: finalHeight }}
          />
        );
      default:
        return null;
    }
  };

  return <>{renderLogo()}</>;
};
