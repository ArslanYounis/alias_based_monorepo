import { SVGProps } from "react";

type IPropType = SVGProps<SVGSVGElement>;

const ActionStatus = ({ width = "24", height = "24", ...props }: IPropType) => {
  return (
    <svg
      {...props}
      width={width}
      height={height}
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.4375 1.96875C17.8742 1.96875 22.2812 6.3758 22.2812 11.8125C22.2812 17.2492 17.8742 21.6562 12.4375 21.6562C7.0008 21.6562 2.59375 17.2492 2.59375 11.8125C2.59375 6.3758 7.0008 1.96875 12.4375 1.96875Z"
        fill="url(#paint0_linear_1463_324)"
      />
      <path
        d="M15.6072 8.82968L11.207 13.2298L9.26783 11.2906C9.12788 11.1602 8.94277 11.0892 8.7515 11.0926C8.56024 11.096 8.37775 11.1734 8.24248 11.3087C8.10722 11.444 8.02973 11.6265 8.02636 11.8177C8.02299 12.009 8.09398 12.1941 8.22439 12.334L10.6853 14.795C10.8238 14.9332 11.0114 15.0109 11.207 15.0109C11.4027 15.0109 11.5903 14.9332 11.7288 14.795L16.6506 9.87311C16.7232 9.80552 16.7814 9.72402 16.8217 9.63345C16.8621 9.54289 16.8838 9.44513 16.8855 9.346C16.8873 9.24687 16.869 9.14841 16.8319 9.05648C16.7948 8.96455 16.7395 8.88104 16.6694 8.81093C16.5993 8.74083 16.5158 8.68556 16.4238 8.64843C16.3319 8.6113 16.2334 8.59306 16.1343 8.59481C16.0352 8.59656 15.9374 8.61826 15.8469 8.65861C15.7563 8.69896 15.6748 8.75714 15.6072 8.82968Z"
        fill="url(#paint1_linear_1463_324)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1463_324"
          x1="3.29659"
          y1="5.66016"
          x2="16.8839"
          y2="19.7761"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#69DB7C" />
          <stop offset="1" stopColor="#2B8A3E" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1463_324"
          x1="9.66945"
          y1="9.26575"
          x2="11.1391"
          y2="16.4517"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#EBFBEE" />
          <stop offset="1" stopColor="#D3F9D8" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default ActionStatus;
