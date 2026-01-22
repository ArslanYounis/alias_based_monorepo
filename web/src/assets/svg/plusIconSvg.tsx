import { SVGProps } from "react";
type IPropType = SVGProps<SVGSVGElement>;
const PlusIconSVG = ({ width = 32, height = 32, ...props }: IPropType) => {
  return (
    <svg
      {...props}
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M16 5.33333C16.7364 5.33333 17.3334 5.93028 17.3334 6.66666V14.6667H25.3334C26.0698 14.6667 26.6667 15.2636 26.6667 16C26.6667 16.7364 26.0698 17.3333 25.3334 17.3333H17.3334V25.3333C17.3334 26.0697 16.7364 26.6667 16 26.6667C15.2637 26.6667 14.6667 26.0697 14.6667 25.3333V17.3333H6.66671C5.93033 17.3333 5.33337 16.7364 5.33337 16C5.33337 15.2636 5.93033 14.6667 6.66671 14.6667H14.6667V6.66666C14.6667 5.93028 15.2637 5.33333 16 5.33333Z"
        fill="white"
      />
    </svg>
  );
};
export default PlusIconSVG;
