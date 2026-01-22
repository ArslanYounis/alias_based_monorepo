import { SVGProps } from "react";
type IPropType = SVGProps<SVGSVGElement>;

const PullyDownIconSvg = (props: IPropType) => {
  return (
    <svg
      {...props}
      width="103"
      height="43"
      viewBox="0 0 103 43"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_814_7968)">
        <path
          d="M26.1757 12C20.3708 12 15.0213 15.144 12.1971 20.2155L0 42.1176H102.297L90.0994 20.2155C87.2752 15.144 81.9257 12 76.1208 12H26.1757Z"
          fill="#7D99A6"
        />
      </g>
      <g clipPath="url(#clip0_814_7968)">
        <path
          d="M40.9186 24.2353L51.1483 29.8824L61.3779 24.2353"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_814_7968"
          x="-12"
          y="0"
          width="126.297"
          height="54.1176"
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
            result="effect1_dropShadow_814_7968"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_814_7968"
            result="shape"
          />
        </filter>
        <clipPath id="clip0_814_7968">
          <rect
            width="22.5882"
            height="40.9186"
            fill="white"
            transform="matrix(0 1 1 0 30.689 15.7647)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default PullyDownIconSvg;
