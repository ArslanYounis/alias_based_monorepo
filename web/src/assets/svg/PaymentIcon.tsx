import { SVGProps } from "react";
type IPropType = SVGProps<SVGSVGElement>;
const PaymentIcon = (props: IPropType) => {
  return (
    <svg
      {...props}
      width="50"
      height="50"
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="3"
        y="7"
        width="34"
        height="26.2286"
        rx="4"
        fill="url(#paint0_linear_2839_92959)"
      />
      <rect
        x="3"
        y="7"
        width="34"
        height="26.2286"
        rx="4"
        fill="url(#paint1_linear_2839_92959)"
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
        d="M48.75 37.5C48.75 34.5163 47.5647 31.6548 45.455 29.545C43.3452 27.4353 40.4837 26.25 37.5 26.25C34.5163 26.25 31.6548 27.4353 29.545 29.545C27.4353 31.6548 26.25 34.5163 26.25 37.5C26.25 40.4837 27.4353 43.3452 29.545 45.455C31.6548 47.5647 34.5163 48.75 37.5 48.75C40.4837 48.75 43.3452 47.5647 45.455 45.455C47.5647 43.3452 48.75 40.4837 48.75 37.5Z"
        fill="url(#paint2_linear_2839_92959)"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M43.3866 32.8672C43.503 32.9833 43.5953 33.1213 43.6584 33.2732C43.7214 33.425 43.7538 33.5878 43.7538 33.7522C43.7538 33.9167 43.7214 34.0795 43.6584 34.2313C43.5953 34.3832 43.503 34.5211 43.3866 34.6372L35.8866 42.1372C35.7705 42.2536 35.6325 42.346 35.4807 42.409C35.3288 42.472 35.166 42.5045 35.0016 42.5045C34.8372 42.5045 34.6744 42.472 34.5225 42.409C34.3706 42.346 34.2327 42.2536 34.1166 42.1372L31.6166 39.6372C31.3819 39.4025 31.25 39.0842 31.25 38.7522C31.25 38.4203 31.3819 38.102 31.6166 37.8672C31.8513 37.6325 32.1696 37.5007 32.5016 37.5007C32.8335 37.5007 33.1519 37.6325 33.3866 37.8672L35.0016 39.4847L41.6166 32.8672C41.7327 32.7508 41.8706 32.6585 42.0225 32.5955C42.1744 32.5324 42.3372 32.5 42.5016 32.5C42.666 32.5 42.8288 32.5324 42.9807 32.5955C43.1325 32.6585 43.2705 32.7508 43.3866 32.8672Z"
        fill="url(#paint3_linear_2839_92959)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_2839_92959"
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
          id="paint1_linear_2839_92959"
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
          id="paint2_linear_2839_92959"
          x1="27.0525"
          y1="30.47"
          x2="42.58"
          y2="46.6025"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#52D17C" />
          <stop offset="1" stopColor="#22918B" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_2839_92959"
          x1="33.5966"
          y1="33.5222"
          x2="36.1166"
          y2="44.6522"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#E3FFD9" />
        </linearGradient>
      </defs>
    </svg>
  );
};
export default PaymentIcon;