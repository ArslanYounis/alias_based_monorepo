import { SVGProps } from "react";
type IPropType = SVGProps<SVGSVGElement>;
const NoPayment = (props: IPropType) => {
  return (
    <svg
      {...props}
      width="50"
      height="50"
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.5">
        <rect
          x="3"
          y="7"
          width="34"
          height="26.2286"
          rx="4"
          fill="url(#paint0_linear_2839_82688)"
        />
        <rect
          x="3"
          y="7"
          width="34"
          height="26.2286"
          rx="4"
          fill="url(#paint1_linear_2839_82688)"
        />
        <rect x="3" y="11.8555" width="34" height="4.85714" fill="black" />
        <rect
          x="6.88672"
          y="23.5156"
          width="7.77143"
          height="4.85714"
          rx="2.42857"
          fill="black"
        />
        <path
          d="M48.75 37.5C48.75 40.4837 47.5647 43.3452 45.455 45.455C43.3452 47.5647 40.4837 48.75 37.5 48.75C34.5163 48.75 31.6548 47.5647 29.545 45.455C27.4353 43.3452 26.25 40.4837 26.25 37.5C26.25 34.5163 27.4353 31.6548 29.545 29.545C31.6548 27.4353 34.5163 26.25 37.5 26.25C40.4837 26.25 43.3452 27.4353 45.455 29.545C47.5647 31.6548 48.75 34.5163 48.75 37.5Z"
          fill="url(#paint2_linear_2839_82688)"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M32.8672 32.8672C32.9833 32.7508 33.1213 32.6585 33.2732 32.5955C33.425 32.5324 33.5878 32.5 33.7522 32.5C33.9167 32.5 34.0795 32.5324 34.2313 32.5955C34.3832 32.6585 34.5211 32.7508 34.6372 32.8672L37.5022 35.7347L40.3672 32.8672C40.6019 32.6325 40.9203 32.5007 41.2522 32.5007C41.5842 32.5007 41.9025 32.6325 42.1372 32.8672C42.372 33.102 42.5038 33.4203 42.5038 33.7522C42.5038 34.0842 42.372 34.4025 42.1372 34.6372L39.2697 37.5022L42.1372 40.3672C42.2535 40.4835 42.3456 40.6214 42.4085 40.7733C42.4714 40.9251 42.5038 41.0879 42.5038 41.2522C42.5038 41.4166 42.4714 41.5793 42.4085 41.7312C42.3456 41.883 42.2535 42.021 42.1372 42.1372C42.021 42.2535 41.883 42.3456 41.7312 42.4085C41.5793 42.4714 41.4166 42.5038 41.2522 42.5038C41.0879 42.5038 40.9251 42.4714 40.7733 42.4085C40.6214 42.3456 40.4835 42.2535 40.3672 42.1372L37.5022 39.2697L34.6372 42.1372C34.4025 42.372 34.0842 42.5038 33.7522 42.5038C33.4203 42.5038 33.102 42.372 32.8672 42.1372C32.6325 41.9025 32.5007 41.5842 32.5007 41.2522C32.5007 40.9203 32.6325 40.602 32.8672 40.3672L35.7347 37.5022L32.8672 34.6372C32.7508 34.5211 32.6585 34.3832 32.5955 34.2313C32.5324 34.0795 32.5 33.9167 32.5 33.7522C32.5 33.5878 32.5324 33.425 32.5955 33.2732C32.6585 33.1213 32.7508 32.9833 32.8672 32.8672Z"
          fill="url(#paint3_linear_2839_82688)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_2839_82688"
          x1="15.1429"
          y1="7"
          x2="23.3638"
          y2="33.3157"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#B3E0FF" />
          <stop offset="1" stopColor="#8CD0FF" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_2839_82688"
          x1="23.6429"
          y1="17.7299"
          x2="28.3329"
          y2="39.2261"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DCF8FF" stopOpacity="0" />
          <stop offset="1" stopColor="#FF6CE8" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_2839_82688"
          x1="29.765"
          y1="27.6575"
          x2="44.5325"
          y2="49.4525"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F83F54" />
          <stop offset="1" stopColor="#CA2134" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_2839_82688"
          x1="33.6947"
          y1="37.8822"
          x2="38.1797"
          y2="42.5472"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FDFDFD" />
          <stop offset="1" stopColor="#FECBE6" />
        </linearGradient>
      </defs>
    </svg>
  );
};
export default NoPayment;