import { SVGProps } from "react";
type IPropType = SVGProps<SVGSVGElement>;
const PullyRightIconSvg = (props: IPropType) => {
  return (
    <svg
      {...props}
      width="32"
      height="115"
      viewBox="0 0 32 115"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_814_7943)">
        <path
          d="M30.1176 26.1757C30.1176 20.3708 26.9736 15.0213 21.9022 12.1971L0 0V102.297L21.9022 90.0994C26.9736 87.2752 30.1176 81.9257 30.1176 76.1208V26.1757Z"
          fill="#7D99A6"
        />
      </g>
      <path
        d="M12.2353 40.9186L17.8823 51.1483L12.2353 61.3779"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <filter
          id="filter0_d_814_7943"
          x="-12"
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
            result="effect1_dropShadow_814_7943"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_814_7943"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};
export default PullyRightIconSvg;
