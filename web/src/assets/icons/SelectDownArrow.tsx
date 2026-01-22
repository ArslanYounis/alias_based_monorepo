import { SVGProps } from "react";
type IPropType = SVGProps<SVGSVGElement>;
const SelectDownArrow = (props: IPropType) => {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.9589 10.2375L12.9389 15.382C12.7376 15.5884 12.46 15.7083 12.166 15.7083C11.8719 15.7083 11.5942 15.5881 11.393 15.3818L6.37314 10.2375C6.09142 9.9488 6.09789 9.48716 6.38761 9.20641C6.67733 8.92566 7.14057 8.93212 7.4223 9.22083L12.166 14.0821L16.9097 9.22083C17.1915 8.93212 17.6547 8.92566 17.9444 9.20641C18.2341 9.48716 18.2406 9.9488 17.9589 10.2375Z"
        fill="currentColor"
      />
    </svg>
  );
};
export default SelectDownArrow;
