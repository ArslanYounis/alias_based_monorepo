import React from "react";
import type { LayoutContainerProps } from "@shared/types";

const containerClassMap: Record<string, string> = {
  "layout-root": "w-screen flex-1 min-h-screen overflow-hidden",
  "layout-row": "flex w-full",
  "layout-main": "relative w-full overflow-auto flex-1 min-h-0",
  "layout-toast-wrap": "relative w-full flex justify-center",
  "layout-children": "w-full",
  "layout-footer":
    "w-full z-50 bg-structure-footer-background border-t border-structure-stroke-default",
};

export const Container: React.FC<LayoutContainerProps> = ({
  children,
  className = "",
  style,
}) => {
  const tw = containerClassMap[className] ?? className;
  return (
    <div className={tw} style={style as React.CSSProperties}>
      {children}
    </div>
  );
};
