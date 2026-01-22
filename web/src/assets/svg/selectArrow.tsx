import React from "react";

interface SelectArrowProps {
  color?: string;
  className?: string;
}

const SelectArrow: React.FC<SelectArrowProps> = ({
  color = "currentColor",
  className,
}) => {
  return (
    <div>
      <svg
        width="18px"
        height="18px"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        color={color}
        className={className}
      >
        <path
          d="M6 9L12 15L18 9"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </svg>
    </div>
  );
};

export default SelectArrow;
