import React from "react";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";

interface AwaySvgProps {
  width?: number;
  height?: number;
}

const AwaySvg: React.FC<AwaySvgProps> = ({ width = 40, height = 40 }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 40 40" fill="none">
      <Defs>
        <LinearGradient
          id="paint0_linear_away"
          x1="8.88837"
          y1="1.48165"
          x2="25.555"
          y2="38.5183"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#1EC8B0" />
          <Stop offset="1" stopColor="#2764E7" />
        </LinearGradient>

        <LinearGradient
          id="paint1_linear_away"
          x1="18.3017"
          y1="11.9133"
          x2="15.0167"
          y2="21.8233"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#FDFDFD" />
          <Stop offset="1" stopColor="#D1D1FF" />
        </LinearGradient>
      </Defs>

      <Path
        d="M20 3.33331C10.795 3.33331 3.33337 10.795 3.33337 20C3.33337 29.205 10.795 36.6666 20 36.6666C29.205 36.6666 36.6667 29.205 36.6667 20C36.6667 10.795 29.205 3.33331 20 3.33331Z"
        fill="url(#paint0_linear_away)"
      />

      <Path
        d="M19.9883 11.08C19.9452 10.7662 19.7845 10.4806 19.5388 10.2807C19.2932 10.0808 18.9808 9.98169 18.6648 10.0033C18.3488 10.0249 18.0528 10.1656 17.8366 10.397C17.6204 10.6284 17.5001 10.9333 17.5 11.25V21.25L17.5117 21.42C17.5527 21.7192 17.7008 21.9935 17.9284 22.192C18.1561 22.3906 18.4479 22.5 18.75 22.5H25.4167L25.5867 22.4883C25.9004 22.4451 26.1861 22.2845 26.3859 22.0388C26.5858 21.7931 26.685 21.4808 26.6634 21.1648C26.6418 20.8488 26.5011 20.5528 26.2697 20.3366C26.0382 20.1204 25.7334 20.0001 25.4167 20H20V11.25L19.9883 11.08Z"
        fill="url(#paint1_linear_away)"
      />
    </Svg>
  );
};

export default AwaySvg;
