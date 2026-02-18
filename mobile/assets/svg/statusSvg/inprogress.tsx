import React from "react";
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  SvgProps,
} from "react-native-svg";

type InprogressSvgProps = SvgProps & {
  width?: number;
  height?: number;
};

const InprogressSvg: React.FC<InprogressSvgProps> = ({
  width = 19,
  height = 19,
  ...props
}) => {
  return (
    <Svg
      {...props}
      width={width}
      height={height}
      viewBox="0 0 14 14"
      fill="none"
    >
      <Defs>
        <LinearGradient
          id={`paint0`}
          x1="0.73225"
          y1="2.78125"
          x2="10.0488"
          y2="12.4608"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#36DFF1" />
          <Stop offset="1" stopColor="#2764E7" />
        </LinearGradient>

        <LinearGradient
          id={`paint1`}
          x1="4.46201"
          y1="4.4755"
          x2="8.10026"
          y2="16.2347"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#FFFFFF" />
          <Stop offset="1" stopColor="#B3E0FF" />
        </LinearGradient>
      </Defs>

      <Path
        d="M2.6875 0.25C2.04103 0.25 1.42105 0.506807 0.963927 0.963927C0.506807 1.42105 0.25 2.04103 0.25 2.6875V11.3125C0.25 11.959 0.506807 12.579 0.963927 13.0361C1.42105 13.4932 2.04103 13.75 2.6875 13.75H11.3125C11.959 13.75 12.579 13.4932 13.0361 13.0361C13.4932 12.579 13.75 11.959 13.75 11.3125V2.6875C13.75 2.04103 13.4932 1.42105 13.0361 0.963927C12.579 0.506807 11.959 0.25 11.3125 0.25H2.6875Z"
        fill={`url(#paint0)`}
      />

      <Path
        d="M10.96 4.96L5.89451 10.0202C5.78904 10.1256 5.64607 10.1848 5.49701 10.1848C5.34794 10.1848 5.20498 10.1256 5.09951 10.0202L3.04001 7.96C2.94065 7.85337 2.88655 7.71233 2.88913 7.56661C2.8917 7.42088 2.95073 7.28184 3.05379 7.17878C3.15685 7.07572 3.29589 7.01669 3.44161 7.01412C3.58734 7.01154 3.72838 7.06564 3.83501 7.165L5.49776 8.827L10.165 4.16425C10.2173 4.11205 10.2794 4.07066 10.3477 4.04245C10.416 4.01423 10.4891 3.99975 10.563 3.99982C10.6369 3.99989 10.7101 4.01451 10.7783 4.04285C10.8466 4.07119 10.9086 4.1127 10.9608 4.165C11.013 4.2173 11.0543 4.27936 11.0826 4.34766C11.1108 4.41595 11.1253 4.48914 11.1252 4.56303C11.1251 4.63692 11.1105 4.71007 11.0822 4.77832C11.0538 4.84656 11.0123 4.90855 10.96 4.96075"
        fill={`url(#paint1)`}
      />
    </Svg>
  );
};

export default InprogressSvg;
