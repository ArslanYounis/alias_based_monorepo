import { useState } from "react";
import { Container } from "@platform/Container";
import { Text } from "@platform/Text";
import { RadioCard } from "@platform/RadioCard";
import SharedLanguageSwitchRenderer from "../SharedLanguageSwitchRenderer";
import ByPlot from "./ByPlot";
import ByOwner from "./ByOwner";
import ByCompanyOwner from "./ByCompanyOwner";
import type { SearchResult } from "./SearchPlotResults";
import type { IOwnerPlotsSearchResult } from "./SearchOwnerPlotsResult";

interface PlotTypeOptions {
  plot: string;
  plot_ar: string;
  company: string;
  company_ar: string;
  owner: string;
  owner_ar: string;
  randomAllocation: string;
  randomAllocation_ar: string;
}

export interface SearchPlotProps {
  selected?: SearchResult[] | null;
  onSubmit?: (val: SearchResult | IOwnerPlotsSearchResult) => void;
  title?: string;
  title_ar?: string;
  subtitle?: string;
  subtitle_ar?: string;
  ownerTypeOptions?: PlotTypeOptions;
  initialOwnerType?: "plot" | "company" | "owner" | "randomAllocation";
  theme?: "light" | "dark";
  language?: "en" | "ar";
  args?: string;
  enabledTabs?: {
    plot?: boolean;
    company?: boolean;
    owner?: boolean;
    randomAllocation?: boolean;
  };
}

// ─── Inline SVG Icons ─────────────────────────────────────────────────────────

const PlotSVGIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 50 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M43.75 39.5833C43.75 44.7917 35.3542 47.9167 25 47.9167C14.6458 47.9167 6.25 44.7917 6.25 39.5833C6.25 34.5708 14.6458 31.25 25 31.25C35.3542 31.25 43.75 34.375 43.75 39.5833Z"
      fill="url(#sp_paint0_radial)"
    />
    <path
      d="M25 4.16797C20.856 4.16797 16.8817 5.81417 13.9515 8.74443C11.0212 11.6747 9.375 15.649 9.375 19.793C9.375 23.818 11.5917 27.7096 14.1 30.868C16.6417 34.0701 19.6792 36.7617 21.7146 38.4138C23.6438 39.9763 26.3562 39.9763 28.2854 38.4138C30.3208 36.7617 33.3583 34.0701 35.9 30.868C38.4083 27.7117 40.625 23.818 40.625 19.793C40.625 15.649 38.9788 11.6747 36.0485 8.74443C33.1183 5.81417 29.144 4.16797 25 4.16797Z"
      fill="url(#sp_paint1_linear)"
    />
    <path
      d="M30.2082 19.7943C30.2082 21.1756 29.6594 22.5004 28.6827 23.4771C27.7059 24.4539 26.3812 25.0026 24.9998 25.0026C23.6185 25.0026 22.2937 24.4539 21.317 23.4771C20.3402 22.5004 19.7915 21.1756 19.7915 19.7943C19.7915 18.4129 20.3402 17.0882 21.317 16.1114C22.2937 15.1347 23.6185 14.5859 24.9998 14.5859C26.3812 14.5859 27.7059 15.1347 28.6827 16.1114C29.6594 17.0882 30.2082 18.4129 30.2082 19.7943Z"
      fill="url(#sp_paint2_linear)"
    />
    <defs>
      <radialGradient
        id="sp_paint0_radial"
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
        id="sp_paint1_linear"
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
        id="sp_paint2_linear"
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

const OwnerIconSvg = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 50 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M37.4997 28.5703C38.9205 28.5703 40.2831 29.1347 41.2878 30.1394C42.2925 31.144 42.8569 32.5067 42.8569 33.9275V35.2042C42.8569 41.5917 35.339 46.4275 24.9997 46.4275C14.6604 46.4275 7.14258 41.8435 7.14258 35.2042V33.9275C7.14258 32.5067 7.70699 31.144 8.71165 30.1394C9.71631 29.1347 11.0789 28.5703 12.4997 28.5703H37.4997Z"
      fill="url(#oi_paint0_linear)"
    />
    <path
      d="M37.4997 28.5703C38.9205 28.5703 40.2831 29.1347 41.2878 30.1394C42.2925 31.144 42.8569 32.5067 42.8569 33.9275V35.2042C42.8569 41.5917 35.339 46.4275 24.9997 46.4275C14.6604 46.4275 7.14258 41.8435 7.14258 35.2042V33.9275C7.14258 32.5067 7.70699 31.144 8.71165 30.1394C9.71631 29.1347 11.0789 28.5703 12.4997 28.5703H37.4997Z"
      fill="url(#oi_paint1_linear)"
    />
    <path
      d="M24.9994 3.57031C26.4065 3.57031 27.7997 3.84745 29.0996 4.38589C30.3995 4.92433 31.5807 5.71354 32.5756 6.70845C33.5705 7.70337 34.3597 8.8845 34.8982 10.1844C35.4366 11.4843 35.7137 12.8776 35.7137 14.2846C35.7137 15.6916 35.4366 17.0849 34.8982 18.3848C34.3597 19.6847 33.5705 20.8658 32.5756 21.8607C31.5807 22.8557 30.3995 23.6449 29.0996 24.1833C27.7997 24.7217 26.4065 24.9989 24.9994 24.9989C22.1578 24.9989 19.4326 23.8701 17.4233 21.8607C15.414 19.8514 14.2852 17.1262 14.2852 14.2846C14.2852 11.443 15.414 8.71777 17.4233 6.70845C19.4326 4.69914 22.1578 3.57031 24.9994 3.57031Z"
      fill="url(#oi_paint2_linear)"
    />
    <defs>
      <linearGradient
        id="oi_paint0_linear"
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
        id="oi_paint1_linear"
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
        id="oi_paint2_linear"
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

const CompanyIconSvg = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 50 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M29.1667 8.85547V45.8346H7.8125C7.3981 45.8346 7.00067 45.67 6.70765 45.377C6.41462 45.084 6.25 44.6865 6.25 44.2721V8.85547C6.25 7.61227 6.74386 6.41998 7.62294 5.54091C8.50201 4.66183 9.6943 4.16797 10.9375 4.16797H24.4792C25.7224 4.16797 26.9147 4.66183 27.7937 5.54091C28.6728 6.41998 29.1667 7.61227 29.1667 8.85547Z"
      fill="url(#ci_paint0_linear)"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M29.1667 8.85547V45.8346H7.8125C7.3981 45.8346 7.00067 45.67 6.70765 45.377C6.41462 45.084 6.25 44.6865 6.25 44.2721V8.85547C6.25 7.61227 6.74386 6.41998 7.62294 5.54091C8.50201 4.66183 9.6943 4.16797 10.9375 4.16797H24.4792C25.7224 4.16797 26.9147 4.66183 27.7937 5.54091C28.6728 6.41998 29.1667 7.61227 29.1667 8.85547Z"
      fill="url(#ci_paint1_linear)"
      fillOpacity="0.2"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M29.1667 8.85547V45.8346H7.8125C7.3981 45.8346 7.00067 45.67 6.70765 45.377C6.41462 45.084 6.25 44.6865 6.25 44.2721V8.85547C6.25 7.61227 6.74386 6.41998 7.62294 5.54091C8.50201 4.66183 9.6943 4.16797 10.9375 4.16797H24.4792C25.7224 4.16797 26.9147 4.66183 27.7937 5.54091C28.6728 6.41998 29.1667 7.61227 29.1667 8.85547Z"
      fill="url(#ci_paint2_linear)"
    />
    <path
      d="M16.6667 12.5013C16.6667 13.0538 16.4472 13.5837 16.0565 13.9744C15.6658 14.3651 15.1359 14.5846 14.5833 14.5846C14.0308 14.5846 13.5009 14.3651 13.1102 13.9744C12.7195 13.5837 12.5 13.0538 12.5 12.5013C12.5 11.9488 12.7195 11.4189 13.1102 11.0282C13.5009 10.6375 14.0308 10.418 14.5833 10.418C15.1359 10.418 15.6658 10.6375 16.0565 11.0282C16.4472 11.4189 16.6667 11.9488 16.6667 12.5013Z"
      fill="url(#ci_paint3_linear)"
    />
    <path
      d="M16.6667 25.0013C16.6667 25.5538 16.4472 26.0837 16.0565 26.4744C15.6658 26.8651 15.1359 27.0846 14.5833 27.0846C14.0308 27.0846 13.5009 26.8651 13.1102 26.4744C12.7195 26.0837 12.5 25.5538 12.5 25.0013C12.5 24.4488 12.7195 23.9189 13.1102 23.5282C13.5009 23.1375 14.0308 22.918 14.5833 22.918C15.1359 22.918 15.6658 23.1375 16.0565 23.5282C16.4472 23.9189 16.6667 24.4488 16.6667 25.0013Z"
      fill="url(#ci_paint4_linear)"
    />
    <path
      d="M16.6667 18.7513C16.6667 19.3038 16.4472 19.8337 16.0565 20.2244C15.6658 20.6151 15.1359 20.8346 14.5833 20.8346C14.0308 20.8346 13.5009 20.6151 13.1102 20.2244C12.7195 19.8337 12.5 19.3038 12.5 18.7513C12.5 18.1988 12.7195 17.6689 13.1102 17.2782C13.5009 16.8875 14.0308 16.668 14.5833 16.668C15.1359 16.668 15.6658 16.8875 16.0565 17.2782C16.4472 17.6689 16.6667 18.1988 16.6667 18.7513Z"
      fill="url(#ci_paint5_linear)"
    />
    <path
      d="M16.6667 31.2513C16.6667 31.8038 16.4472 32.3337 16.0565 32.7244C15.6658 33.1151 15.1359 33.3346 14.5833 33.3346C14.0308 33.3346 13.5009 33.1151 13.1102 32.7244C12.7195 32.3337 12.5 31.8038 12.5 31.2513C12.5 30.6988 12.7195 30.1689 13.1102 29.7782C13.5009 29.3875 14.0308 29.168 14.5833 29.168C15.1359 29.168 15.6658 29.3875 16.0565 29.7782C16.4472 30.1689 16.6667 30.6988 16.6667 31.2513Z"
      fill="url(#ci_paint6_linear)"
    />
    <path
      d="M16.6667 37.5013C16.6667 38.0538 16.4472 38.5837 16.0565 38.9744C15.6658 39.3651 15.1359 39.5846 14.5833 39.5846C14.0308 39.5846 13.5009 39.3651 13.1102 38.9744C12.7195 38.5837 12.5 38.0538 12.5 37.5013C12.5 36.9488 12.7195 36.4189 13.1102 36.0282C13.5009 35.6375 14.0308 35.418 14.5833 35.418C15.1359 35.418 15.6658 35.6375 16.0565 36.0282C16.4472 36.4189 16.6667 36.9488 16.6667 37.5013Z"
      fill="url(#ci_paint7_linear)"
    />
    <path
      d="M39.0622 10.418C40.3054 10.418 41.4977 10.9118 42.3767 11.7909C43.2558 12.67 43.7497 13.8623 43.7497 15.1055V44.2721C43.7497 44.6865 43.5851 45.084 43.292 45.377C42.999 45.67 42.6016 45.8346 42.1872 45.8346H22.9226C22.6485 45.8355 22.3769 45.7822 22.1234 45.6778C21.8699 45.5735 21.6395 45.4202 21.4454 45.2267C21.2513 45.0331 21.0973 44.8032 20.9922 44.55C20.8871 44.2968 20.833 44.0254 20.833 43.7513V15.1055C20.833 13.8623 21.3269 12.67 22.2059 11.7909C23.085 10.9118 24.2773 10.418 25.5205 10.418H39.0622Z"
      fill="url(#ci_paint8_linear)"
    />
    <path
      d="M27.083 39.5833C27.083 39.0308 27.3025 38.5009 27.6932 38.1102C28.0839 37.7195 28.6138 37.5 29.1663 37.5H35.4163C35.9689 37.5 36.4988 37.7195 36.8895 38.1102C37.2802 38.5009 37.4997 39.0308 37.4997 39.5833V45.8333H27.083V39.5833Z"
      fill="url(#ci_paint9_linear)"
    />
    <path
      d="M31.2497 18.7513C31.2497 19.3038 31.0302 19.8337 30.6395 20.2244C30.2488 20.6151 29.7189 20.8346 29.1663 20.8346C28.6138 20.8346 28.0839 20.6151 27.6932 20.2244C27.3025 19.8337 27.083 19.3038 27.083 18.7513C27.083 18.1988 27.3025 17.6689 27.6932 17.2782C28.0839 16.8875 28.6138 16.668 29.1663 16.668C29.7189 16.668 30.2488 16.8875 30.6395 17.2782C31.0302 17.6689 31.2497 18.1988 31.2497 18.7513Z"
      fill="url(#ci_paint10_linear)"
    />
    <path
      d="M31.2497 25.0013C31.2497 25.5538 31.0302 26.0837 30.6395 26.4744C30.2488 26.8651 29.7189 27.0846 29.1663 27.0846C28.6138 27.0846 28.0839 26.8651 27.6932 26.4744C27.3025 26.0837 27.083 25.5538 27.083 25.0013C27.083 24.4488 27.3025 23.9189 27.6932 23.5282C28.0839 23.1375 28.6138 22.918 29.1663 22.918C29.7189 22.918 30.2488 23.1375 30.6395 23.5282C31.0302 23.9189 31.2497 24.4488 31.2497 25.0013Z"
      fill="url(#ci_paint11_linear)"
    />
    <path
      d="M31.2497 31.2513C31.2497 31.8038 31.0302 32.3337 30.6395 32.7244C30.2488 33.1151 29.7189 33.3346 29.1663 33.3346C28.6138 33.3346 28.0839 33.1151 27.6932 32.7244C27.3025 32.3337 27.083 31.8038 27.083 31.2513C27.083 30.6988 27.3025 30.1689 27.6932 29.7782C28.0839 29.3875 28.6138 29.168 29.1663 29.168C29.7189 29.168 30.2488 29.3875 30.6395 29.7782C31.0302 30.1689 31.2497 30.6988 31.2497 31.2513Z"
      fill="url(#ci_paint12_linear)"
    />
    <path
      d="M37.4997 18.7513C37.4997 19.3038 37.2802 19.8337 36.8895 20.2244C36.4988 20.6151 35.9689 20.8346 35.4163 20.8346C34.8638 20.8346 34.3339 20.6151 33.9432 20.2244C33.5525 19.8337 33.333 19.3038 33.333 18.7513C33.333 18.1988 33.5525 17.6689 33.9432 17.2782C34.3339 16.8875 34.8638 16.668 35.4163 16.668C35.9689 16.668 36.4988 16.8875 36.8895 17.2782C37.2802 17.6689 37.4997 18.1988 37.4997 18.7513Z"
      fill="url(#ci_paint13_linear)"
    />
    <path
      d="M37.4997 25.0013C37.4997 25.5538 37.2802 26.0837 36.8895 26.4744C36.4988 26.8651 35.9689 27.0846 35.4163 27.0846C34.8638 27.0846 34.3339 26.8651 33.9432 26.4744C33.5525 26.0837 33.333 25.5538 33.333 25.0013C33.333 24.4488 33.5525 23.9189 33.9432 23.5282C34.3339 23.1375 34.8638 22.918 35.4163 22.918C35.9689 22.918 36.4988 23.1375 36.8895 23.5282C37.2802 23.9189 37.4997 24.4488 37.4997 25.0013Z"
      fill="url(#ci_paint14_linear)"
    />
    <path
      d="M37.4997 31.2513C37.4997 31.8038 37.2802 32.3337 36.8895 32.7244C36.4988 33.1151 35.9689 33.3346 35.4163 33.3346C34.8638 33.3346 34.3339 33.1151 33.9432 32.7244C33.5525 32.3337 33.333 31.8038 33.333 31.2513C33.333 30.6988 33.5525 30.1689 33.9432 29.7782C34.3339 29.3875 34.8638 29.168 35.4163 29.168C35.9689 29.168 36.4988 29.3875 36.8895 29.7782C37.2802 30.1689 37.4997 30.6988 37.4997 31.2513Z"
      fill="url(#ci_paint15_linear)"
    />
    <defs>
      <linearGradient id="ci_paint0_linear" x1="7.06875" y1="11.9805" x2="31.8604" y2="26.1471" gradientUnits="userSpaceOnUse">
        <stop stopColor="#A3A3FF" />
        <stop offset="1" stopColor="#5750E2" />
      </linearGradient>
      <linearGradient id="ci_paint1_linear" x1="14.2708" y1="9.3763" x2="22.2917" y2="9.3763" gradientUnits="userSpaceOnUse">
        <stop stopColor="#30116E" stopOpacity="0" />
        <stop offset="1" stopColor="#30116E" />
      </linearGradient>
      <linearGradient id="ci_paint2_linear" x1="22.5792" y1="16.8638" x2="22.2083" y2="4.17005" gradientUnits="userSpaceOnUse">
        <stop stopColor="#A3A3FF" stopOpacity="0" />
        <stop offset="1" stopColor="#A3A3FF" />
      </linearGradient>
      <linearGradient id="ci_paint3_linear" x1="11.1104" y1="9.02839" x2="16.6667" y2="40.9742" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDFDFD" />
        <stop offset="1" stopColor="#D1D1FF" />
      </linearGradient>
      <linearGradient id="ci_paint4_linear" x1="11.1104" y1="9.02839" x2="16.6667" y2="40.9742" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDFDFD" />
        <stop offset="1" stopColor="#D1D1FF" />
      </linearGradient>
      <linearGradient id="ci_paint5_linear" x1="11.1104" y1="9.02839" x2="16.6667" y2="40.9742" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDFDFD" />
        <stop offset="1" stopColor="#D1D1FF" />
      </linearGradient>
      <linearGradient id="ci_paint6_linear" x1="11.1104" y1="9.0284" x2="16.6667" y2="40.9742" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDFDFD" />
        <stop offset="1" stopColor="#D1D1FF" />
      </linearGradient>
      <linearGradient id="ci_paint7_linear" x1="11.1104" y1="9.0284" x2="16.6667" y2="40.9742" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDFDFD" />
        <stop offset="1" stopColor="#D1D1FF" />
      </linearGradient>
      <linearGradient id="ci_paint8_linear" x1="20.833" y1="11.5242" x2="54.0434" y2="39.0346" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3BD5FF" />
        <stop offset="1" stopColor="#2764E7" />
      </linearGradient>
      <linearGradient id="ci_paint9_linear" x1="28.758" y1="39.0625" x2="34.3205" y2="46.2875" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0067BF" />
        <stop offset="1" stopColor="#003580" />
      </linearGradient>
      <linearGradient id="ci_paint10_linear" x1="30.208" y1="14.8159" x2="38.9705" y2="34.5325" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDFDFD" />
        <stop offset="1" stopColor="#B3E0FF" />
      </linearGradient>
      <linearGradient id="ci_paint11_linear" x1="30.208" y1="14.8159" x2="38.9705" y2="34.5326" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDFDFD" />
        <stop offset="1" stopColor="#B3E0FF" />
      </linearGradient>
      <linearGradient id="ci_paint12_linear" x1="30.208" y1="14.8159" x2="38.9705" y2="34.5326" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDFDFD" />
        <stop offset="1" stopColor="#B3E0FF" />
      </linearGradient>
      <linearGradient id="ci_paint13_linear" x1="30.208" y1="14.8159" x2="38.9705" y2="34.5326" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDFDFD" />
        <stop offset="1" stopColor="#B3E0FF" />
      </linearGradient>
      <linearGradient id="ci_paint14_linear" x1="30.208" y1="14.8159" x2="38.9705" y2="34.5326" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDFDFD" />
        <stop offset="1" stopColor="#B3E0FF" />
      </linearGradient>
      <linearGradient id="ci_paint15_linear" x1="30.208" y1="14.8159" x2="38.9705" y2="34.5326" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDFDFD" />
        <stop offset="1" stopColor="#B3E0FF" />
      </linearGradient>
    </defs>
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

const SearchPlot = ({
  args = "",
  title = "",
  title_ar = "",
  subtitle = "",
  subtitle_ar = "",
  ownerTypeOptions = {
    plot: "By Plot",
    plot_ar: "حسب قطعة الأرض",
    company: "By Company Owner",
    company_ar: "حسب مالك الشركة",
    owner: "By Owner",
    owner_ar: "حسب المالك",
    randomAllocation: "Random Allocation",
    randomAllocation_ar: "التخصيص العشوائي",
  },
  initialOwnerType = "plot",
  selected = [],
  onSubmit = () => {},
  language = "en",
  enabledTabs = {
    plot: true,
    company: true,
    owner: true,
    randomAllocation: true,
  },
}: SearchPlotProps) => {
  const allowedTabs = {
    plot: enabledTabs.plot !== false,
    company: enabledTabs.company === true,
    owner: enabledTabs.owner === true,
    randomAllocation: enabledTabs.randomAllocation === true,
  };

  const safeSelected = Array.isArray(selected) ? selected : [];

  const [ownerType, setOwnerType] = useState<
    "plot" | "owner" | "company" | "randomAllocation"
  >(allowedTabs[initialOwnerType] ? initialOwnerType : "plot");

  const handleOwnerTypeChange = (id?: string) => {
    if (id) {
      setOwnerType(id as "plot" | "owner" | "company" | "randomAllocation");
    }
  };

  return (
    <Container
      className="flex flex-col w-full"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {!!title && (
        <Text className="text-heading-h2 font-bold text-text-default mb-[14px]">
          <SharedLanguageSwitchRenderer
            language={language}
            value={title}
            value_ar={title_ar || title}
          />
        </Text>
      )}
      {!!subtitle && (
        <Text className="text-m text-text-default mb-8">
          <SharedLanguageSwitchRenderer
            language={language}
            value={subtitle}
            value_ar={subtitle_ar || subtitle}
          />
        </Text>
      )}

      {/* Owner Type Selection */}
      <Container className="flex gap-l mb-8">
        <RadioCard
          icon={
            <PlotSVGIcon className="!w-[30px] !h-[30px] sm:!w-[50px] sm:!h-[50px]" />
          }
          label={ownerTypeOptions.plot}
          label_ar={ownerTypeOptions.plot_ar}
          iconLocation="top"
          clicked={ownerType === "plot"}
          id="plot"
          onClick={handleOwnerTypeChange}
          language={language}
        />
        {allowedTabs?.company && (
          <RadioCard
            icon={
              <CompanyIconSvg className="!w-[30px] !h-[30px] sm:!w-[50px] sm:!h-[50px]" />
            }
            label={ownerTypeOptions.company}
            label_ar={ownerTypeOptions.company_ar}
            iconLocation="top"
            clicked={ownerType === "company"}
            id="company"
            onClick={handleOwnerTypeChange}
            language={language}
          />
        )}
        {allowedTabs?.owner && (
          <RadioCard
            icon={
              <OwnerIconSvg className="!w-[30px] !h-[30px] sm:!w-[50px] sm:!h-[50px]" />
            }
            label={ownerTypeOptions.owner}
            label_ar={ownerTypeOptions.owner_ar}
            iconLocation="top"
            clicked={ownerType === "owner"}
            id="owner"
            onClick={handleOwnerTypeChange}
            language={language}
          />
        )}
        {allowedTabs?.randomAllocation && (
          <RadioCard
            icon={
              <OwnerIconSvg className="!w-[30px] !h-[30px] sm:!w-[50px] sm:!h-[50px]" />
            }
            label={ownerTypeOptions.randomAllocation}
            label_ar={ownerTypeOptions.randomAllocation_ar}
            iconLocation="top"
            clicked={ownerType === "randomAllocation"}
            id="randomAllocation"
            language={language}
            disabled={true}
          />
        )}
      </Container>

      {/* Render the selected form */}
      {ownerType === "plot" && allowedTabs?.plot && (
        <ByPlot
          args={args}
          selected={safeSelected}
          language={language}
          onSelectResult={(result) => onSubmit?.(result)}
        />
      )}
      {ownerType === "company" && allowedTabs?.company && (
        <ByCompanyOwner
          args={args}
          selected={safeSelected?.map((item) => ({
            ...item,
            ownerId: item?.ownerId ?? "",
          }))}
          language={language}
          onSubmit={(result) => onSubmit?.(result)}
        />
      )}
      {ownerType === "owner" && allowedTabs?.owner && (
        <ByOwner
          args={args}
          selected={safeSelected?.map((item) => ({
            ...item,
            ownerId: item.ownerId ?? "",
          }))}
          language={language}
          onSubmit={(result) => onSubmit?.(result)}
        />
      )}
    </Container>
  );
};

export default SearchPlot;
