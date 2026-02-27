import React from "react";
import Svg, { Path, Defs, LinearGradient, RadialGradient, Stop } from "react-native-svg";
import type { SvgProps } from "react-native-svg";

interface DocumentIconProps extends SvgProps {
  width?: number;
  height?: number;
}

const DocumentIcon: React.FC<DocumentIconProps> = ({
  width = 24,
  height = 24,
  ...props
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 40 40"
    fill="none"
    {...props}
  >
    <Path
      d="M21.25 2.5H10C9.00544 2.5 8.05161 2.89509 7.34835 3.59835C6.64509 4.30161 6.25 5.25544 6.25 6.25V33.75C6.25 34.7446 6.64509 35.6984 7.34835 36.4016C8.05161 37.1049 9.00544 37.5 10 37.5H30C30.9946 37.5 31.9484 37.1049 32.6517 36.4016C33.3549 35.6984 33.75 34.7446 33.75 33.75V15L25 11.25L21.25 2.5Z"
      fill="url(#paint0_linear)"
    />
    <Path
      d="M21.25 2.5H10C9.00544 2.5 8.05161 2.89509 7.34835 3.59835C6.64509 4.30161 6.25 5.25544 6.25 6.25V33.75C6.25 34.7446 6.64509 35.6984 7.34835 36.4016C8.05161 37.1049 9.00544 37.5 10 37.5H30C30.9946 37.5 31.9484 37.1049 32.6517 36.4016C33.3549 35.6984 33.75 34.7446 33.75 33.75V15L25 11.25L21.25 2.5Z"
      fill="url(#paint1_radial)"
      fillOpacity="0.5"
    />
    <Path
      d="M21.25 12.5V2.5L33.75 15H23.75C23.087 15 22.4511 14.7366 21.9822 14.2678C21.5134 13.7989 21.25 13.163 21.25 12.5Z"
      fill="url(#paint2_linear)"
    />
    <Defs>
      <LinearGradient
        id="paint0_linear"
        x1="25.5"
        y1="2.5"
        x2="28.3887"
        y2="32.0125"
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#6CE0FF" />
        <Stop offset="1" stopColor="#4894FE" />
      </LinearGradient>
      <RadialGradient
        id="paint1_radial"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(34.8959 3.59341) rotate(133.108) scale(21.7975 12.8566)"
      >
        <Stop offset="0.362" stopColor="#4A43CB" />
        <Stop offset="1" stopColor="#4A43CB" stopOpacity="0" />
      </RadialGradient>
      <LinearGradient
        id="paint2_linear"
        x1="27.4787"
        y1="7.70875"
        x2="24.3537"
        y2="12.9163"
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#9FF0F9" />
        <Stop offset="1" stopColor="#B3E0FF" />
      </LinearGradient>
    </Defs>
  </Svg>
);

export default DocumentIcon;
