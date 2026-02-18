import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface StatusUpProps extends SvgProps {
  size?: number;
  color?: string;
}

const StatusUp = ({
  size = 24,
  color = "currentColor",
  ...props
}: StatusUpProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M16 16V8M12 16V11M8 16V13"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3 20.4V3.6C3 3.44087 3.06321 3.28826 3.17574 3.17574C3.28826 3.06321 3.44087 3 3.6 3H20.4C20.5591 3 20.7117 3.06321 20.8243 3.17574C20.9368 3.28826 21 3.44087 21 3.6V20.4C21 20.5591 20.9368 20.7117 20.8243 20.8243C20.7117 20.9368 20.5591 21 20.4 21H3.6C3.44087 21 3.28826 20.9368 3.17574 20.8243C3.06321 20.7117 3 20.5591 3 20.4Z"
        stroke={color}
        strokeWidth="1.5"
      />
    </Svg>
  );
};

export default StatusUp;
