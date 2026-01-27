import React from "react";
import Svg, {
  Path,
  Defs,
  Stop,
  SvgProps,
  LinearGradient,
} from "react-native-svg";

type OfflineSvgProps = SvgProps & {
  width?: number;
  height?: number;
};

const OfflineSvg: React.FC<OfflineSvgProps> = ({
  width = 40,
  height = 40,
  ...props
}) => {
  // Prevent gradient ID collisions (FlatList-safe)
  const uniqueId = React.useId();

  return (
    <Svg
      {...props}
      width={width}
      height={height}
      viewBox="0 0 40 40"
      fill="none"
    >
      <Defs>
        <LinearGradient
          id={`paint0_${uniqueId}`}
          x1="7.96875"
          y1="4.6875"
          x2="29.5"
          y2="35"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#F16569" />
          <Stop offset="1" stopColor="#EE3E43" />
        </LinearGradient>

        <LinearGradient
          id={`paint1_${uniqueId}`}
          x1="13.3712"
          y1="20.6625"
          x2="21.1812"
          y2="28.785"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#FDECEC" />
          <Stop offset="1" stopColor="#FCD8D9" />
        </LinearGradient>
      </Defs>

      <Path
        d="M20 2.5C10.335 2.5 2.5 10.335 2.5 20C2.5 29.665 10.335 37.5 20 37.5C29.665 37.5 37.5 29.665 37.5 20C37.5 10.335 29.665 2.5 20 2.5Z"
        fill={`url(#paint0_${uniqueId})`}
      />

      <Path
        d="M27.1337 12.8662C27.3681 13.1006 27.4997 13.4185 27.4997 13.75C27.4997 14.0814 27.3681 14.3993 27.1337 14.6337L21.7675 20L27.1337 25.3662C27.3614 25.602 27.4874 25.9177 27.4846 26.2455C27.4817 26.5732 27.3503 26.8867 27.1185 27.1185C26.8867 27.3503 26.5732 27.4817 26.2455 27.4846C25.9177 27.4874 25.602 27.3614 25.3662 27.1337L20 21.7675L14.6337 27.1337C14.398 27.3614 14.0822 27.4874 13.7545 27.4846C13.4267 27.4817 13.1132 27.3503 12.8815 27.1185C12.6497 26.8867 12.5182 26.5732 12.5154 26.2455C12.5125 25.9177 12.6385 25.602 12.8662 25.3662L18.2325 20L12.8662 14.6337C12.7468 14.5184 12.6516 14.3805 12.5861 14.228C12.5206 14.0755 12.4861 13.9115 12.4847 13.7455C12.4832 13.5795 12.5149 13.4149 12.5777 13.2613C12.6406 13.1077 12.7334 12.9681 12.8507 12.8507C12.9681 12.7334 13.1077 12.6406 13.2613 12.5777C13.4149 12.5149 13.5795 12.4832 13.7455 12.4847C13.9115 12.4861 14.0755 12.5206 14.228 12.5861C14.3805 12.6516 14.5184 12.7468 14.6337 12.8662L20 18.2325L25.3662 12.8662C25.6006 12.6319 25.9185 12.5002 26.25 12.5002C26.5814 12.5002 26.8993 12.6319 27.1337 12.8662Z"
        fill={`url(#paint1_${uniqueId})`}
      />
    </Svg>
  );
};

export default OfflineSvg;
