import { SVGProps } from "react";

type IPropType = SVGProps<SVGSVGElement> & {
  className?: string;
};

const OwnerIcon = ({ className, ...props }: IPropType) => {
  return (
    <svg
      {...props}
      className={className}
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M37.4997 28.5703C38.9205 28.5703 40.2831 29.1347 41.2878 30.1394C42.2925 31.144 42.8569 32.5067 42.8569 33.9275V35.2042C42.8569 41.5917 35.339 46.4275 24.9997 46.4275C14.6604 46.4275 7.14258 41.8435 7.14258 35.2042V33.9275C7.14258 32.5067 7.70699 31.144 8.71165 30.1394C9.71631 29.1347 11.0789 28.5703 12.4997 28.5703H37.4997Z"
        fill="url(#paint0_linear_2517_111127)"
      />
      <path
        d="M37.4997 28.5703C38.9205 28.5703 40.2831 29.1347 41.2878 30.1394C42.2925 31.144 42.8569 32.5067 42.8569 33.9275V35.2042C42.8569 41.5917 35.339 46.4275 24.9997 46.4275C14.6604 46.4275 7.14258 41.8435 7.14258 35.2042V33.9275C7.14258 32.5067 7.70699 31.144 8.71165 30.1394C9.71631 29.1347 11.0789 28.5703 12.4997 28.5703H37.4997Z"
        fill="url(#paint1_linear_2517_111127)"
      />
      <path
        d="M24.9994 3.57031C26.4065 3.57031 27.7997 3.84745 29.0996 4.38589C30.3995 4.92433 31.5807 5.71354 32.5756 6.70845C33.5705 7.70337 34.3597 8.8845 34.8982 10.1844C35.4366 11.4843 35.7137 12.8776 35.7137 14.2846C35.7137 15.6916 35.4366 17.0849 34.8982 18.3848C34.3597 19.6847 33.5705 20.8658 32.5756 21.8607C31.5807 22.8557 30.3995 23.6449 29.0996 24.1833C27.7997 24.7217 26.4065 24.9989 24.9994 24.9989C22.1578 24.9989 19.4326 23.8701 17.4233 21.8607C15.414 19.8514 14.2852 17.1262 14.2852 14.2846C14.2852 11.443 15.414 8.71777 17.4233 6.70845C19.4326 4.69914 22.1578 3.57031 24.9994 3.57031Z"
        fill="url(#paint2_linear_2517_111127)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_2517_111127"
          x1="15.6354"
          y1="30.9435"
          x2="21.4051"
          y2="49.3685"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.125" stopColor="#9C6CFE" />
          <stop offset="1" stopColor="#7A41DC" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_2517_111127"
          x1="24.9997"
          y1="26.4435"
          x2="33.0783"
          y2="56.631"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#885EDB" stopOpacity="0" />
          <stop offset="1" stopColor="#E362F8" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_2517_111127"
          x1="19.3816"
          y1="6.41853"
          x2="30.3012"
          y2="23.8578"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.125" stopColor="#9C6CFE" />
          <stop offset="1" stopColor="#7A41DC" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default OwnerIcon;
