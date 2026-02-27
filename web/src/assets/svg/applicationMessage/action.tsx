import { SVGProps } from "react";
type IPropType = SVGProps<SVGSVGElement>;

const Action = (props: IPropType) => {
  return (
    <svg
      {...props}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.3714 16.0022L4.45255 19.4285L16.8217 17.1256C18.0674 16.8936 18.0674 15.1108 16.8217 14.8788L4.45369 12.5759L5.3714 16.0022Z"
        fill="url(#paint0_radial_6392_39259)"
      />
      <path
        d="M4.33142 2.99997C3.23084 2.47425 2.0217 3.47997 2.33599 4.65825L4.63999 13.2685C4.69773 13.4849 4.81776 13.6795 4.98519 13.8283C5.15261 13.977 5.36003 14.0733 5.5817 14.1051L16.8777 15.7188C17.2046 15.7645 17.2046 16.2377 16.8777 16.2845L5.58284 17.8971C5.36118 17.929 5.15375 18.0252 4.98633 18.1739C4.81891 18.3227 4.69887 18.5173 4.64113 18.7337L2.33599 27.3474C2.0217 28.5245 3.23084 29.5303 4.33142 29.0057L28.9006 17.2914C29.9851 16.7748 29.9851 15.2297 28.9006 14.7131L4.33142 2.99997Z"
        fill="url(#paint1_linear_6392_39259)"
      />
      <path
        d="M4.33142 2.99997C3.23084 2.47425 2.0217 3.47997 2.33599 4.65825L4.63999 13.2685C4.69773 13.4849 4.81776 13.6795 4.98519 13.8283C5.15261 13.977 5.36003 14.0733 5.5817 14.1051L16.8777 15.7188C17.2046 15.7645 17.2046 16.2377 16.8777 16.2845L5.58284 17.8971C5.36118 17.929 5.15375 18.0252 4.98633 18.1739C4.81891 18.3227 4.69887 18.5173 4.64113 18.7337L2.33599 27.3474C2.0217 28.5245 3.23084 29.5303 4.33142 29.0057L28.9006 17.2914C29.9851 16.7748 29.9851 15.2297 28.9006 14.7131L4.33142 2.99997Z"
        fill="url(#paint2_linear_6392_39259)"
      />
      <defs>
        <radialGradient
          id="paint0_radial_6392_39259"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(0.445689 16.0022) scale(10.9829 1.64065)"
        >
          <stop stopColor="#0094F0" />
          <stop offset="1" stopColor="#2052CB" />
        </radialGradient>
        <linearGradient
          id="paint1_linear_6392_39259"
          x1="2.2857"
          y1="-7.82289"
          x2="24.5211"
          y2="23"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3BD5FF" />
          <stop offset="1" stopColor="#0094F0" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_6392_39259"
          x1="16"
          y1="9.94282"
          x2="22.6183"
          y2="28.6251"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.125" stopColor="#DCF8FF" stopOpacity="0" />
          <stop offset="0.769" stopColor="#FF6CE8" stopOpacity="0.7" />
        </linearGradient>
      </defs>
    </svg>
  );
};
export default Action;
