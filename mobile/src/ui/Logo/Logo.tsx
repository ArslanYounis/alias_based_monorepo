import type { LogoProps } from "@shared/types";
import React from "react";
import { View } from "react-native";
import { SvgUri } from "react-native-svg";
import OneHub from "~/assets/svg/icons/OneHub";

export type { LogoProps };

export const Logo: React.FC<LogoProps> = ({
  type,
  className,
  width,
  height,
}) => {
  let defaultWidth: number;
  let defaultHeight: number;

  switch (type) {
    case "full":
      defaultWidth = 300;
      defaultHeight = 66;
      break;
    case "icon":
      defaultWidth = 33;
      defaultHeight = 37;
      break;
    case "hub":
      defaultWidth = 52;
      defaultHeight = 34;
      break;
    default:
      defaultWidth = 0;
      defaultHeight = 0;
  }

  const finalWidth = (typeof width === "number" ? width : undefined) ?? defaultWidth;
  const finalHeight = (typeof height === "number" ? height : undefined) ?? defaultHeight;

  const renderLogo = () => {
    switch (type) {
      case "full":
        return (
          <SvgUri
            uri="https://adrec-images.mastermind-mindset.com/dmtLogo.svg"
            width={finalWidth}
            height={finalHeight}
          />
        );

      case "icon":
        return (
          <SvgUri
            uri="https://adrec-images.mastermind-mindset.com/dmtIocn.svg"
            width={finalWidth}
            height={finalHeight}
          />
        );

      case "hub":
        return (
          <OneHub
            width={finalWidth}
            height={finalHeight}
            className={className}
          />
        );

      default:
        return null;
    }
  };

  return <View>{renderLogo()}</View>;
};
