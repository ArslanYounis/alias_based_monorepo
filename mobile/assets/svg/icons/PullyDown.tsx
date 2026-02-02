import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface PullyDownProps extends SvgProps {
  width?: number;
  height?: number;
  color?: string;
}

const PullyDown = ({
  width = 103,
  height = 43,
  color = "#7D99A6",
  style,
  ...props
}: PullyDownProps) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 103 43"
      fill="none"
      style={style}
      {...props}
    >
      <Path
        d="M26.1757 12C20.3708 12 15.0213 15.144 12.1971 20.2155L0 42.1176H102.297L90.0994 20.2155C87.2752 15.144 81.9257 12 76.1208 12H26.1757Z"
        fill={color}
      />

      <Path
        d="M40.9186 24.2353L51.1483 29.8824L61.3779 24.2353"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default PullyDown;
