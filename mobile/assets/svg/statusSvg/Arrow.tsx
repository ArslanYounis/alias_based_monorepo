import React from "react";
import Svg, { Path, Defs, Stop, LinearGradient } from "react-native-svg";

interface ArrowSvgProps {
  width?: number;
  height?: number;
}

const ArrowSvg: React.FC<ArrowSvgProps> = ({ width = 32, height = 32 }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 32 32" fill="none">
      <Defs>
        <LinearGradient
          id="paint0_linear"
          x1="3.929"
          y1="7.875"
          x2="24.357"
          y2="24.125"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#36DFF1" />
          <Stop offset="1" stopColor="#2764E7" />
        </LinearGradient>

        <LinearGradient
          id="paint1_linear"
          x1="10.0832"
          y1="20.3139"
          x2="34.5832"
          y2="9.00594"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="white" />
          <Stop offset="1" stopColor="#B3E0FF" />
        </LinearGradient>
      </Defs>

      <Path
        d="M3 7.5C3 6.30653 3.47411 5.16193 4.31802 4.31802C5.16193 3.47411 6.30653 3 7.5 3H24.5C25.6935 3 26.8381 3.47411 27.682 4.31802C28.5259 5.16193 29 6.30653 29 7.5V24.5C29 25.6935 28.5259 26.8381 27.682 27.682C26.8381 28.5259 25.6935 29 24.5 29H7.5C6.30653 29 5.16193 28.5259 4.31802 27.682C3.47411 26.8381 3 25.6935 3 24.5V7.5Z"
        fill="url(#paint0_linear)"
      />

      <Path
        d="M15.2992 9.29894C15.1117 9.48647 15.0064 9.74078 15.0064 10.0059C15.0064 10.2711 15.1117 10.5254 15.2992 10.7129L19.5922 15.0059H10.0062C9.74095 15.0059 9.48659 15.1113 9.29906 15.2988C9.11152 15.4864 9.00616 15.7407 9.00616 16.0059C9.00616 16.2712 9.11152 16.5255 9.29906 16.713C9.48659 16.9006 9.74095 17.0059 10.0062 17.0059H19.5922L15.2992 21.2989C15.117 21.4875 15.0162 21.7401 15.0185 22.0023C15.0208 22.2645 15.1259 22.5154 15.3113 22.7008C15.4968 22.8862 15.7476 22.9913 16.0098 22.9936C16.272 22.9959 16.5246 22.8951 16.7132 22.7129L22.7132 16.7129C22.9006 16.5254 23.006 16.2711 23.006 16.0059C23.006 15.7408 22.9006 15.4865 22.7132 15.2989L16.7132 9.29894C16.5256 9.11147 16.2713 9.00615 16.0062 9.00615C15.741 9.00615 15.4867 9.11147 15.2992 9.29894Z"
        fill="url(#paint1_linear)"
      />
    </Svg>
  );
};

export default ArrowSvg;
