import { SVGProps } from "react";

type IPropType = SVGProps<SVGSVGElement> & {
  color?: string;
};

const PlusIcon = (props: IPropType) => {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
   
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 4.33203C12.5523 4.33203 13 4.76109 13 5.29036V11.0404H19C19.5523 11.0404 20 11.4694 20 11.9987C20 12.528 19.5523 12.957 19 12.957H13V18.707C13 19.2363 12.5523 19.6654 12 19.6654C11.4477 19.6654 11 19.2363 11 18.707V12.957H5C4.44772 12.957 4 12.528 4 11.9987C4 11.4694 4.44772 11.0404 5 11.0404H11V5.29036C11 4.76109 11.4477 4.33203 12 4.33203Z"
        fill={props.color || props.fill || "white"}
      />
    </svg>
  );
};

export default PlusIcon;
