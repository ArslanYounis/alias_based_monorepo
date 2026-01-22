import { SVGProps } from "react";
type IPropType = SVGProps<SVGSVGElement>;
const ServiceArrowRight= (props: IPropType) => {
  return (
    <svg
      {...props}
      width="37"
      height="37"
      viewBox="0 0 37 37"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.24967 18.5H28.5205M28.5205 18.5L19.2705 9.25M28.5205 18.5L19.2705 27.75"
        stroke="#169F9F"
        strokeWidth="2.3125"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export default ServiceArrowRight;