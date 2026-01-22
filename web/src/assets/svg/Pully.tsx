import { SVGProps } from "react";

type IPropType = SVGProps<SVGSVGElement>;

const PullyIconSvg = (props: IPropType) => {
  return (
    <svg
      {...props}
      width="32"
      height="115"
      viewBox="0 0 32 115"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_40_1212)">
        <path
          d="M1.88235 26.1757C1.88235 20.3708 5.02636 15.0213 10.0978 12.1971L32 0V102.297L10.0978 90.0994C5.02635 87.2752 1.88235 81.9257 1.88235 76.1208V26.1757Z"
          fill="#7D99A6"
        />
      </g>
      <path
        d="M19.7647 40.9186L14.1177 51.1483L19.7647 61.3779"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <filter
          id="filter0_d_40_1212"
          x="-10.1176"
          y="-12"
          width="54.1176"
          height="126.297"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="6" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_40_1212"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_40_1212"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default PullyIconSvg;
