import { SVGProps } from "react";

type IPropType = SVGProps<SVGSVGElement>;

const SearchIcon = ({ width = 20, height = 20, ...props }: IPropType) => {
  return (
    <svg
      {...props}
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.33334 3.33366C5.57191 3.33366 3.33334 5.57224 3.33334 8.33366C3.33334 11.0951 5.57191 13.3337 8.33334 13.3337C11.0948 13.3337 13.3333 11.0951 13.3333 8.33366C13.3333 5.57224 11.0948 3.33366 8.33334 3.33366ZM1.66667 8.33366C1.66667 4.65176 4.65144 1.66699 8.33334 1.66699C12.0152 1.66699 15 4.65176 15 8.33366C15 9.87425 14.4774 11.2928 13.5999 12.4217L18.0893 16.9111C18.4147 17.2365 18.4147 17.7641 18.0893 18.0896C17.7638 18.415 17.2362 18.415 16.9107 18.0896L12.4214 13.6002C11.2925 14.4778 9.87393 15.0003 8.33334 15.0003C4.65144 15.0003 1.66667 12.0156 1.66667 8.33366Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default SearchIcon;
