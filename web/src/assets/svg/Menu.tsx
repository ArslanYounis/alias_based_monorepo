




import { SVGProps } from "react";
type IPropType = SVGProps<SVGSVGElement>;
const MenuIconSvg= (props: IPropType) => {
  return (
    <svg
      {...props}
      width="40"
      height="36"
      viewBox="0 0 40 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="40" height="36" rx="4" fill="#E8F5F5" />
      <path
        d="M11 11H29"
        stroke="#59595F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 18H29"
        stroke="#59595F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 25H29"
        stroke="#59595F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export default MenuIconSvg;
