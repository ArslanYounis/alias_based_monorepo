import { SVGProps } from "react";
type IPropType = SVGProps<SVGSVGElement> & {
  className?: string;
};
const PlotSVG = ({ className, ...props }: IPropType) => {
  return (
    <svg
      {...props}
      className={className}
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M43.75 39.5833C43.75 44.7917 35.3542 47.9167 25 47.9167C14.6458 47.9167 6.25 44.7917 6.25 39.5833C6.25 34.5708 14.6458 31.25 25 31.25C35.3542 31.25 43.75 34.375 43.75 39.5833Z"
        fill="url(#paint0_radial_2678_88511)"
      />
      <path
        d="M25 4.16797C20.856 4.16797 16.8817 5.81417 13.9515 8.74443C11.0212 11.6747 9.375 15.649 9.375 19.793C9.375 23.818 11.5917 27.7096 14.1 30.868C16.6417 34.0701 19.6792 36.7617 21.7146 38.4138C23.6438 39.9763 26.3562 39.9763 28.2854 38.4138C30.3208 36.7617 33.3583 34.0701 35.9 30.868C38.4083 27.7117 40.625 23.818 40.625 19.793C40.625 15.649 38.9788 11.6747 36.0485 8.74443C33.1183 5.81417 29.144 4.16797 25 4.16797Z"
        fill="url(#paint1_linear_2678_88511)"
      />
      <path
        d="M30.2082 19.7943C30.2082 21.1756 29.6594 22.5004 28.6827 23.4771C27.7059 24.4539 26.3812 25.0026 24.9998 25.0026C23.6185 25.0026 22.2937 24.4539 21.317 23.4771C20.3402 22.5004 19.7915 21.1756 19.7915 19.7943C19.7915 18.4129 20.3402 17.0882 21.317 16.1114C22.2937 15.1347 23.6185 14.5859 24.9998 14.5859C26.3812 14.5859 27.7059 15.1347 28.6827 16.1114C29.6594 17.0882 30.2082 18.4129 30.2082 19.7943Z"
        fill="url(#paint2_linear_2678_88511)"
      />
      <defs>
        <radialGradient
          id="paint0_radial_2678_88511"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(23.6607 36.8058) rotate(-10.678) scale(29.9835 13.2939)"
        >
          <stop stopColor="#7B7BFF" />
          <stop offset="0.502" stopColor="#A3A3FF" />
          <stop offset="1" stopColor="#CEB0FF" />
        </radialGradient>
        <linearGradient
          id="paint1_linear_2678_88511"
          x1="2.53958"
          y1="-5.95078"
          x2="27.5042"
          y2="34.4784"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F97DBD" />
          <stop offset="1" stopColor="#D7257D" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_2678_88511"
          x1="20.3957"
          y1="20.2547"
          x2="25.8207"
          y2="25.8943"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FDFDFD" />
          <stop offset="1" stopColor="#FECBE6" />
        </linearGradient>
      </defs>
    </svg>
  );
};
export default PlotSVG;
