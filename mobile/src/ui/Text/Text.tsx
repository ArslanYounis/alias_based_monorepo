import type { TextProps } from "@shared/types";
import React from "react";
import { Text as RNText, TextProps as RNTextProps } from "react-native";

export type { TextProps };

export const Text: React.FC<RNTextProps> = ({ children, ...props }) => {
  return <RNText {...props}>{children}</RNText>;
};
