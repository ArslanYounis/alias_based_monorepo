import { SVGProps } from "react";
type IPropType = SVGProps<SVGSVGElement>;
const OneIcon = (props: IPropType) => {
  return (
    <svg
      {...props}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.5 16.9V3.1C2.5 2.76863 2.76863 2.5 3.1 2.5H16.9C17.2314 2.5 17.5 2.76863 17.5 3.1V16.9C17.5 17.2314 17.2314 17.5 16.9 17.5H3.1C2.76863 17.5 2.5 17.2314 2.5 16.9Z"
        stroke="#169F9F"
        strokeWidth="1.5"
      />
      <path
        d="M10.8333 13.3337V6.66699L8.33334 9.16699"
        stroke="#169F9F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export default OneIcon;
