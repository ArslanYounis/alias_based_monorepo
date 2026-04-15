import type { TextProps } from "@shared/types";
import React from "react";
import { Text as RNText, TextProps as RNTextProps } from "react-native";

export type { TextProps };

const TEXT_ALIGN_RE = /\btext-(left|center|right|justify|start|end)\b/;

export const Text: React.FC<RNTextProps> = ({ children, style, ...props }) => {
   const hasTextAlign = TEXT_ALIGN_RE.test(props?.className || "");
   return (
     <RNText
       style={hasTextAlign ? [{ includeFontPadding: false }, style] : [{ textAlign: "left", includeFontPadding: false }, style]}
       {...props}
     >
       {children}
     </RNText>
   );
};
