import { SVGProps } from "react";
type IPropType = SVGProps<SVGSVGElement>;
const GreaterArrow = (props: IPropType) => {
  const strokeColor = props.color || props.stroke || "currentColor";
  return (
    <svg
      {...props}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 6L15 12L9 18"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export default GreaterArrow;
