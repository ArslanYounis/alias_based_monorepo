import { SVGProps } from "react";
type IPropType = SVGProps<SVGSVGElement> & { color?: string };
const UAENationalSvg = (props: IPropType) => {
  const { color = "currentColor", ...rest } = props;
  return (
    <svg
      {...rest}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 3.49342C8.4301 2.57603 10.1499 2.04102 12 2.04102C16.1031 2.04102 19.5649 4.67233 20.6482 8.27018"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 21.2077V13.541"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 21.2077V10.666C3 9.65794 3.18046 8.69026 3.51212 7.79102"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 21.2077V10.9535C18 7.6191 15.3137 4.91602 12 4.91602C8.68629 4.91602 6 7.6191 6 10.9535V13.541"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 21.2083V17.375"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 21.2077V10.8098C9 9.14256 10.3431 7.79102 12 7.79102C12.8653 7.79102 13.645 8.15964 14.1926 8.74935"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 21.2077V13.541"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 21.2077V17.8535"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 10.666V13.541"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export default UAENationalSvg;
