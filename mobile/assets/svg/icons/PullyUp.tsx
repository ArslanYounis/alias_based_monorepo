import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface PullyUpSvgProps extends SvgProps {
  width?: number;
  height?: number;
  color?: string;
}

const PullyUp = ({
  width = 103,
  height = 44,
  color = "#7D99A6",
  style,
  ...props
}: PullyUpSvgProps) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 103 44"
      fill="none"
      style={style}
      {...props}
    >
      <Path
        d="M26.1757 1.88235C20.3708 1.88235 15.0213 5.02636 12.1971 10.0978L0 32H102.297L90.0994 10.0978C87.2752 5.02635 81.9257 1.88235 76.1208 1.88235H26.1757Z"
        fill={color}
      />

      <Path
        d="M40.9186 19.7647L51.1483 14.1176L61.3779 19.7647"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default PullyUp;
