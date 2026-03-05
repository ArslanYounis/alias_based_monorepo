import React from "react";
import { ScrollView } from "react-native";
import type { ScrollContainerProps } from "@shared/types";

export const ScrollContainer: React.FC<ScrollContainerProps> = ({
  children,
  className = "",
  horizontal = false,
  style,
}) => {
  return (
    <ScrollView
      className={className}
      style={style as object}
      horizontal={horizontal}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
};
