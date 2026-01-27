import React from "react";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";

interface CompleteSvgProps {
  width?: number;
  height?: number;
}

const CompleteSvg: React.FC<CompleteSvgProps> = ({
  width = 27,
  height = 27,
}) => {
  // Prevent gradient ID collisions (important in lists)
  const uniqueId = React.useId();

  return (
    <Svg width={width} height={height} viewBox="0 0 34 34" fill="none">
      <Defs>
        <LinearGradient
          id={`paint0_${uniqueId}`}
          x1="1.52337"
          y1="6.58331"
          x2="24.5284"
          y2="30.4833"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#69DB7C" />
          <Stop offset="1" stopColor="#2B8A3E" />
        </LinearGradient>

        <LinearGradient
          id={`paint1_${uniqueId}`}
          x1="12.3134"
          y1="12.6883"
          x2="14.8017"
          y2="24.855"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#EBFBEE" />
          <Stop offset="1" stopColor="#D3F9D8" />
        </LinearGradient>
      </Defs>

      <Path
        d="M17 0.333313C26.205 0.333313 33.6667 7.79498 33.6667 17C33.6667 26.205 26.205 33.6666 17 33.6666C7.79504 33.6666 0.333374 26.205 0.333374 17C0.333374 7.79498 7.79504 0.333313 17 0.333313Z"
        fill={`url(#paint0_${uniqueId})`}
      />

      <Path
        d="M22.3667 11.95L14.9167 19.4L11.6334 16.1166C11.3964 15.8958 11.083 15.7756 10.7592 15.7813C10.4354 15.7871 10.1264 15.9182 9.89737 16.1473C9.66834 16.3763 9.53716 16.6853 9.53144 17.0091C9.52573 17.3329 9.64594 17.6463 9.86674 17.8833L14.0334 22.05C14.2678 22.2841 14.5855 22.4155 14.9167 22.4155C15.248 22.4155 15.5657 22.2841 15.8001 22.05L24.1334 13.7166C24.2562 13.6022 24.3547 13.4642 24.423 13.3109C24.4914 13.1575 24.5281 12.992 24.5311 12.8242C24.534 12.6563 24.5031 12.4896 24.4403 12.334C24.3774 12.1783 24.2838 12.0369 24.1651 11.9182C24.0464 11.7995 23.905 11.706 23.7494 11.6431C23.5938 11.5802 23.427 11.5494 23.2592 11.5523C23.0914 11.5553 22.9258 11.592 22.7725 11.6603C22.6192 11.7287 22.4812 11.8272 22.3667 11.95Z"
        fill={`url(#paint1_${uniqueId})`}
      />
    </Svg>
  );
};

export default CompleteSvg;
