import React from "react";
import type { ScrollContainerProps } from "@shared/types";

export const ScrollContainer: React.FC<ScrollContainerProps> = ({
  children,
  className = "",
  horizontal = false,
  style,
}) => {
  const overflowClass = horizontal ? "overflow-x-auto" : "overflow-y-auto";
  return (
    <div className={`${overflowClass} ${className}`} style={style as React.CSSProperties}>
      {children}
    </div>
  );
};
