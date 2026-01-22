import { SVGProps } from "react";
type IPropType = SVGProps<SVGSVGElement>;
const DefaultIcon = (props: IPropType) => {
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
        d="M18.3333 8.33333L6.66667 8.33333C5.00679e-06 8.33333 5.00679e-06 17.5 6.66667 17.5M18.3333 8.33333L12.5 2.5M18.3333 8.33333L12.5 14.1667"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export default DefaultIcon;
