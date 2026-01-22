import { SVGProps } from "react";
type IPropType = SVGProps<SVGSVGElement>;
const TabListSVG = (props: IPropType) => {
  return (
    <svg
      {...props}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.66666 10.6667H9.33333"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.33333 5.33333L7.64222 2.17888C7.86745 2.06627 8.13254 2.06627 8.35777 2.17888L14.6667 5.33333"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3333 7.33333V11.3333C13.3333 12.8061 12.1394 14 10.6667 14H5.33334C3.86058 14 2.66667 12.8061 2.66667 11.3333V7.33333"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export default TabListSVG;
