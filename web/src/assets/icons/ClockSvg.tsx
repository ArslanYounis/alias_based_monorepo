

import { SVGProps } from "react";

type IPropType = SVGProps<SVGSVGElement>;
const ClockSvg = (props: IPropType) => {
  return (
    <svg
      {...props}
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 10L20 20L30 20"
        stroke="#B8B8BB"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.9997 36.6663C29.2044 36.6663 36.6663 29.2044 36.6663 19.9997C36.6663 10.7949 29.2044 3.33301 19.9997 3.33301C10.7949 3.33301 3.33301 10.7949 3.33301 19.9997C3.33301 29.2044 10.7949 36.6663 19.9997 36.6663Z"
        stroke="#B8B8BB"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ClockSvg;




