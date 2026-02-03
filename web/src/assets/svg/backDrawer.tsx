import { type SVGProps } from "react";
type IPropType = SVGProps<SVGSVGElement>;

const BackDrawer = ({ className, ...props }: IPropType) => {
  const strokeColor = props.color || props.stroke || "currentColor";
  return (
    <svg
      {...props}
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`cursor-pointer ${className ?? ""}`}
    >
      <path
        d="M24.1161 9.11612C24.6043 8.62796 25.3955 8.62796 25.8837 9.11612C26.3718 9.60427 26.3718 10.3955 25.8837 10.8837L16.7675 19.9999L25.8837 29.1161C26.3718 29.6043 26.3718 30.3955 25.8837 30.8837C25.3955 31.3719 24.6043 31.3719 24.1161 30.8837L14.1161 20.8837C13.628 20.3955 13.628 19.6043 14.1161 19.1161L24.1161 9.11612Z"
        fill={strokeColor}
      />
    </svg>
  );
};
export default BackDrawer;
