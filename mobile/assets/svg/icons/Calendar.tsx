import React from "react";
import Svg, { Path } from "react-native-svg";

interface CalendarIconProps {
  color?: string;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Calendar icon (from web lucide-react / ADREC date input).
 * Use for DateInput trigger instead of dropdown arrow.
 */
const CalendarIcon: React.FC<CalendarIconProps> = ({
  color = "#414149",
  width = 20,
  height = 20,
  className,
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <Path d="M8 2v4" />
      <Path d="M16 2v4" />
      <Path d="M3 10h18" />
      <Path d="M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
    </Svg>
  );
};

export default CalendarIcon;
