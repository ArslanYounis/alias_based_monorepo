import type { TextProps } from "@shared/types";
import React from "react";

export type { TextProps };

export const Text: React.FC<TextProps> = ({ children, style, className }) => {
  return (
    <span style={style} className={className}>
      {children}
    </span>
  );
};
