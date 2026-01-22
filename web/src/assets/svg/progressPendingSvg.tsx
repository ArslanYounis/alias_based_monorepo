import { SVGProps } from "react";
type IPropType = SVGProps<SVGSVGElement>;
const ProgressPendingSVG = (props: IPropType) => {
  return (
    <svg
      {...props}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 2.66666C8.63599 2.66666 2.66666 8.636 2.66666 16C2.66666 23.364 8.63599 29.3333 16 29.3333C23.364 29.3333 29.3333 23.364 29.3333 16C29.3333 8.636 23.364 2.66666 16 2.66666Z"
        fill="url(#paint0_linear_820_397)"
      />
      <path
        d="M15.9907 8.864C15.9561 8.613 15.8276 8.38447 15.6311 8.22458C15.4345 8.06469 15.1846 7.98536 14.9318 8.00263C14.6791 8.0199 14.4423 8.13248 14.2693 8.31761C14.0963 8.50275 14.0001 8.74664 14 9V17L14.0093 17.136C14.0422 17.3754 14.1606 17.5948 14.3428 17.7536C14.5249 17.9125 14.7583 18 15 18H20.3333L20.4693 17.9907C20.7203 17.9561 20.9489 17.8276 21.1088 17.6311C21.2686 17.4345 21.348 17.1846 21.3307 16.9318C21.3134 16.6791 21.2009 16.4423 21.0157 16.2693C20.8306 16.0963 20.5867 16.0001 20.3333 16H16V9L15.9907 8.864Z"
        fill="url(#paint1_linear_820_397)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_820_397"
          x1="7.11066"
          y1="1.18533"
          x2="20.444"
          y2="30.8147"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#1EC8B0" />
          <stop offset="1" stopColor="#2764E7" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_820_397"
          x1="14.6413"
          y1="9.53067"
          x2="12.0133"
          y2="17.4587"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FDFDFD" />
          <stop offset="1" stopColor="#D1D1FF" />
        </linearGradient>
      </defs>
    </svg>
  );
};
export default ProgressPendingSVG;
