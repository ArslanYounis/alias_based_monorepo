import React from "react";

interface OnlineSvgProps {
  width?: number | string;
  height?: number | string;
}

const OnlineSvg: React.FC<OnlineSvgProps> = ({ width = 40, height = 40 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 3.33331C29.205 3.33331 36.6667 10.795 36.6667 20C36.6667 29.205 29.205 36.6666 20 36.6666C10.795 36.6666 3.33337 29.205 3.33337 20C3.33337 10.795 10.795 3.33331 20 3.33331Z"
      fill="url(#paint0_linear_225_1639)"
    />
    <path
      d="M25.3667 14.95L17.9167 22.4L14.6334 19.1166C14.3964 18.8958 14.083 18.7756 13.7592 18.7813C13.4354 18.7871 13.1264 18.9182 12.8974 19.1473C12.6683 19.3763 12.5372 19.6853 12.5314 20.0091C12.5257 20.3329 12.6459 20.6463 12.8667 20.8833L17.0334 25.05C17.2678 25.2841 17.5855 25.4155 17.9167 25.4155C18.248 25.4155 18.5657 25.2841 18.8001 25.05L27.1334 16.7166C27.2562 16.6022 27.3547 16.4642 27.423 16.3109C27.4914 16.1575 27.5281 15.992 27.5311 15.8242C27.534 15.6563 27.5031 15.4896 27.4403 15.334C27.3774 15.1783 27.2838 15.0369 27.1651 14.9182C27.0464 14.7995 26.905 14.706 26.7494 14.6431C26.5938 14.5802 26.427 14.5494 26.2592 14.5523C26.0914 14.5553 25.9258 14.592 25.7725 14.6603C25.6192 14.7287 25.4812 14.8272 25.3667 14.95Z"
      fill="url(#paint1_linear_225_1639)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_225_1639"
        x1="4.52337"
        y1="9.58331"
        x2="27.5284"
        y2="33.4833"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#69DB7C" />
        <stop offset="1" stopColor="#2B8A3E" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_225_1639"
        x1="15.3134"
        y1="15.6883"
        x2="17.8017"
        y2="27.855"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#EBFBEE" />
        <stop offset="1" stopColor="#D3F9D8" />
      </linearGradient>
    </defs>
  </svg>
);

export default OnlineSvg;
