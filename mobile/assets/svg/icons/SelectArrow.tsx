import React from "react";
import Svg, { Path } from "react-native-svg";

interface SelectArrowProps {
  color?: string;
  width?: number;
  height?: number;
  className?: string;
}

const SelectArrow: React.FC<SelectArrowProps> = ({
  color = "currentColor",
  width = 18,
  height = 18,
  className,
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <Path
        d="M6 9L12 15L18 9"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default SelectArrow;
