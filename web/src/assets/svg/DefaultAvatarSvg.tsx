// components/DefaultAvatarSvg.tsx
import React from "react";

const DefaultAvatarSvg: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity="0.5">
      <rect
        x="0.5"
        y="0.5"
        width="31"
        height="31"
        rx="15.5"
        fill="url(#pattern0)"
        stroke="black"
      />
    </g>
    <defs>
      <pattern
        id="pattern0"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <image
          id="image0"
          width="947"
          height="874"
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,...YOUR_BASE64_DATA_HERE..."
        />
      </pattern>
    </defs>
  </svg>
);

export default DefaultAvatarSvg;
