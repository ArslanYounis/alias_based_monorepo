import { SVGProps } from "react";
type IPropType = SVGProps<SVGSVGElement>;

const CrossIcon = (props: IPropType) => {
  const strokeColor = props.color || props.stroke || "currentColor";
  return (
    <svg
      {...props}
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={props.className}
    >
      <path
        d="M11.2631 28.7377L20.0009 20M28.7386 11.2623L20.0009 20M20.0009 20L11.2631 11.2623M20.0009 20L28.7386 28.7377"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export default CrossIcon;
