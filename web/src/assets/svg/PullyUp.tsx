import { SVGProps } from "react";
type IPropType = SVGProps<SVGSVGElement>;
const PullyUpIconSvg = (props: IPropType) => {
  return (
    <svg
      {...props}
      width="103"
      height="44"
      viewBox="0 0 103 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_814_7964)">
        <path
          d="M26.1757 1.88235C20.3708 1.88235 15.0213 5.02636 12.1971 10.0978L0 32H102.297L90.0994 10.0978C87.2752 5.02635 81.9257 1.88235 76.1208 1.88235H26.1757Z"
          fill="#7D99A6"
        />
      </g>
      <g clipPath="url(#clip0_814_7964)">
        <path
          d="M40.9186 19.7647L51.1483 14.1176L61.3779 19.7647"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_814_7964"
          x="-12"
          y="-10.1176"
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
            result="effect1_dropShadow_814_7964"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_814_7964"
            result="shape"
          />
        </filter>
        <clipPath id="clip0_814_7964">
          <rect
            width="22.5882"
            height="40.9186"
            fill="white"
            transform="matrix(0 1 1 0 30.689 5.64706)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};
export default PullyUpIconSvg;
