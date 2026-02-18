import React from "react";
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  SvgProps,
} from "react-native-svg";

interface SelectedSvgProps extends SvgProps {
  width?: number;
  height?: number;
}

const SelectedSvg: React.FC<SelectedSvgProps> = ({
  width = 40,
  height = 40,
  ...props
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 40 40"
      fill="none"
      {...props}
    >
      <Defs>
        <LinearGradient
          id={`paint0`}
          x1={6.07167}
          y1={10.625}
          x2={26.775}
          y2={32.135}
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset={0} stopColor="#36DFF1" />
          <Stop offset={1} stopColor="#2764E7" />
        </LinearGradient>
        <LinearGradient
          id={`paint1`}
          x1={14.36}
          y1={14.39}
          x2={22.445}
          y2={40.5217}
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset={0} stopColor="white" />
          <Stop offset={1} stopColor="#B3E0FF" />
        </LinearGradient>
      </Defs>

      <Path
        d="M10.4167 5C8.98008 5 7.60233 5.57068 6.5865 6.5865C5.57068 7.60233 5 8.98008 5 10.4167V29.5833C5 31.0199 5.57068 32.3977 6.5865 33.4135C7.60233 34.4293 8.98008 35 10.4167 35H29.5833C31.0199 35 32.3977 34.4293 33.4135 33.4135C34.4293 32.3977 35 31.0199 35 29.5833V10.4167C35 8.98008 34.4293 7.60233 33.4135 6.5865C32.3977 5.57068 31.0199 5 29.5833 5H10.4167Z"
        fill={`url(#paint0)`}
      />
      <Path
        d="M28.8 15.4667L17.5433 26.7117C17.3089 26.9458 16.9912 27.0772 16.66 27.0772C16.3287 27.0772 16.011 26.9458 15.7767 26.7117L11.2 22.1333C10.9792 21.8964 10.859 21.583 10.8647 21.2591C10.8704 20.9353 11.0016 20.6263 11.2306 20.3973C11.4596 20.1683 11.7686 20.0371 12.0925 20.0314C12.4163 20.0257 12.7297 20.1459 12.9667 20.3667L16.6617 24.06L27.0333 13.6983C27.1495 13.5823 27.2875 13.4904 27.4392 13.4277C27.591 13.365 27.7536 13.3328 27.9178 13.3329C28.082 13.3331 28.2446 13.3656 28.3963 13.4286C28.5479 13.4916 28.6857 13.5838 28.8017 13.7C28.9177 13.8162 29.0096 13.9542 29.0723 14.1059C29.135 14.2577 29.1672 14.4203 29.1671 14.5845C29.1669 14.7487 29.1344 14.9113 29.0714 15.0629C29.0084 15.2146 28.9162 15.3523 28.8 15.4683"
        fill={`url(#paint1)`}
      />
    </Svg>
  );
};

export default SelectedSvg;
