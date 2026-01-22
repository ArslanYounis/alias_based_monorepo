import * as React from "react";

const Document: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M21.25 2.5H10C9.00544 2.5 8.05161 2.89509 7.34835 3.59835C6.64509 4.30161 6.25 5.25544 6.25 6.25V33.75C6.25 34.7446 6.64509 35.6984 7.34835 36.4016C8.05161 37.1049 9.00544 37.5 10 37.5H30C30.9946 37.5 31.9484 37.1049 32.6517 36.4016C33.3549 35.6984 33.75 34.7446 33.75 33.75V15L25 11.25L21.25 2.5Z" fill="url(#paint0_linear_641_19709)"/>
    <path d="M21.25 2.5H10C9.00544 2.5 8.05161 2.89509 7.34835 3.59835C6.64509 4.30161 6.25 5.25544 6.25 6.25V33.75C6.25 34.7446 6.64509 35.6984 7.34835 36.4016C8.05161 37.1049 9.00544 37.5 10 37.5H30C30.9946 37.5 31.9484 37.1049 32.6517 36.4016C33.3549 35.6984 33.75 34.7446 33.75 33.75V15L25 11.25L21.25 2.5Z" fill="url(#paint1_radial_641_19709)" fillOpacity="0.5"/>
    <path d="M21.25 12.5V2.5L33.75 15H23.75C23.087 15 22.4511 14.7366 21.9822 14.2678C21.5134 13.7989 21.25 13.163 21.25 12.5Z" fill="url(#paint2_linear_641_19709)"/>
    <defs>
      <linearGradient id="paint0_linear_641_19709" x1="25.5" y1="2.5" x2="28.3887" y2="32.0125" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6CE0FF"/>
        <stop offset="1" stopColor="#4894FE"/>
      </linearGradient>
      <radialGradient id="paint1_radial_641_19709" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(34.8959 3.59341) rotate(133.108) scale(21.7975 12.8566)">
        <stop offset="0.362" stopColor="#4A43CB"/>
        <stop offset="1" stopColor="#4A43CB" stopOpacity="0"/>
      </radialGradient>
      <linearGradient id="paint2_linear_641_19709" x1="27.4787" y1="7.70875" x2="24.3537" y2="12.9163" gradientUnits="userSpaceOnUse">
        <stop stopColor="#9FF0F9"/>
        <stop offset="1" stopColor="#B3E0FF"/>
      </linearGradient>
    </defs>
  </svg>
);

export default Document;
