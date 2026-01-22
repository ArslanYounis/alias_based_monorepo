import { SVGProps } from "react";
type IPropType = SVGProps<SVGSVGElement>;
const CrossIconSvg = (props: IPropType) => {
  return (
    <svg
      {...props}
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.057 11.057C11.5777 10.5363 12.4219 10.5363 12.9426 11.057L19.9998 18.1142L27.057 11.057C27.5777 10.5363 28.4219 10.5363 28.9426 11.057C29.4633 11.5777 29.4633 12.4219 28.9426 12.9426L21.8855 19.9998L28.9426 27.057C29.4633 27.5777 29.4633 28.4219 28.9426 28.9426C28.4219 29.4633 27.5777 29.4633 27.057 28.9426L19.9998 21.8855L12.9426 28.9426C12.4219 29.4633 11.5777 29.4633 11.057 28.9426C10.5363 28.4219 10.5363 27.5777 11.057 27.057L18.1142 19.9998L11.057 12.9426C10.5363 12.4219 10.5363 11.5777 11.057 11.057Z"
        fill={props.fill || "#59595F"}
      />
    </svg>
  );
};
export default CrossIconSvg;
