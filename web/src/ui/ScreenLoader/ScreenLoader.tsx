import React from "react";
import type { ScreenLoaderProps } from "@shared/types";

export type { ScreenLoaderProps };

const ScreenLoader: React.FC<ScreenLoaderProps> = ({
  isLoading = false,
  gifSrc = "https://adrec-images.mastermind-mindset.com/TrailLoading.gif",
  alt = "Loading...",
}) => {
  if (!isLoading) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 w-screen h-screen bg-[#CCCCCC66] backdrop-blur-xs">
      <img src={gifSrc} alt={alt} className="w-20 h-20" />
    </div>
  );
};

export default ScreenLoader;
