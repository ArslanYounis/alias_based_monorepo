/* eslint-disable @typescript-eslint/no-unused-vars */

import { SVGProps } from "react";
type IPropType = SVGProps<SVGSVGElement>;
const PrimarySuccessSVG = ({
  width = 32,
  height = 32,
  ...props
}: IPropType) => {
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
        d="M16 2.66666C23.364 2.66666 29.3333 8.63599 29.3333 16C29.3333 23.364 23.364 29.3333 16 29.3333C8.63599 29.3333 2.66666 23.364 2.66666 16C2.66666 8.63599 8.63599 2.66666 16 2.66666Z"
        fill="url(#paint0_linear_820_597)"
      />
      <path
        d="M20.2933 11.96L14.3333 17.92L11.7067 15.2933C11.5171 15.1167 11.2664 15.0205 11.0073 15.0251C10.7482 15.0297 10.501 15.1346 10.3178 15.3178C10.1346 15.5011 10.0297 15.7482 10.0251 16.0073C10.0205 16.2664 10.1167 16.5171 10.2933 16.7067L13.6267 20.04C13.8142 20.2273 14.0683 20.3325 14.3333 20.3325C14.5983 20.3325 14.8525 20.2273 15.04 20.04L21.7067 13.3733C21.8049 13.2818 21.8837 13.1714 21.9384 13.0487C21.993 12.9261 22.0224 12.7936 22.0248 12.6594C22.0271 12.5251 22.0024 12.3917 21.9522 12.2672C21.9019 12.1427 21.827 12.0296 21.732 11.9346C21.6371 11.8397 21.524 11.7648 21.3995 11.7145C21.2749 11.6642 21.1416 11.6395 21.0073 11.6419C20.873 11.6442 20.7406 11.6736 20.6179 11.7283C20.4953 11.7829 20.3849 11.8618 20.2933 11.96Z"
        fill="url(#paint1_linear_820_597)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_820_597"
          x1="3.61866"
          y1="7.66666"
          x2="22.0227"
          y2="26.7867"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#69DB7C" />
          <stop offset="1" stopColor="#2B8A3E" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_820_597"
          x1="12.2507"
          y1="12.5507"
          x2="14.2413"
          y2="22.284"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#EBFBEE" />
          <stop offset="1" stopColor="#D3F9D8" />
        </linearGradient>
      </defs>
    </svg>
  );
};
export default PrimarySuccessSVG;
