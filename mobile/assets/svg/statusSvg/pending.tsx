import React from "react";
import Svg, { Path, G, Defs, ClipPath, Rect, SvgProps } from "react-native-svg";

type PendingSvgProps = SvgProps & {
  width?: number;
  height?: number;
};

const PendingSvg: React.FC<PendingSvgProps> = ({
  width = 27,
  height = 27,
  ...props
}) => {
  // Unique ID is not strictly necessary for this icon (no gradients), but kept for consistency
  const uniqueId = React.useId();

  return (
    <Svg
      {...props}
      width={width}
      height={height}
      viewBox="0 0 18 19"
      fill="none"
    >
      <G clipPath={`url(#clip0_${uniqueId})`}>
        <Path
          d="M9 4.8L9 9.4L13.5 9.39999"
          stroke="#D0D0D1"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M9 17.0667C13.1421 17.0667 16.5 13.6342 16.5 9.4C16.5 5.16581 13.1421 1.73333 9 1.73333C4.85786 1.73333 1.5 5.16581 1.5 9.4C1.5 13.6342 4.85786 17.0667 9 17.0667Z"
          stroke="#D0D0D1"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id={`clip0_${uniqueId}`}>
          <Rect
            width={18}
            height={18.4}
            fill="white"
            transform="translate(0 0.199997)"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default PendingSvg;
