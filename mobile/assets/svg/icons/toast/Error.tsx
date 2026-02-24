import React from "react";
import Svg, { Path } from "react-native-svg";

interface ToastErrorProps {
  color?: string;
  width?: number;
  height?: number;
}

/** Circle with exclamation (i) - matches web toast error. */
const ToastError: React.FC<ToastErrorProps> = ({
  color = "#ee3e43",
  width = 24,
  height = 24,
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 7L12 13"
      stroke={color}
      strokeWidth={2.25}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 17.01L12.01 16.9989"
      stroke={color}
      strokeWidth={2.25}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      stroke={color}
      strokeWidth={2.25}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ToastError;
