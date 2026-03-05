import React from "react";
import { View, Pressable } from "react-native";
import type { ContainerProps } from "@shared/types";

const containerClassMap: Record<string, string> = {
  "layout-root": "flex-1",
  "layout-row": "flex flex-row flex-1",
  "layout-main": "flex-1 overflow-hidden",
  "layout-toast-wrap": "items-center",
  "layout-children": "flex-1",
  "layout-footer":
    "w-full py-4 px-4 border-t border-structure-stroke-default",
};

export const Container: React.FC<ContainerProps> = ({
  children,
  className = "",
  style,
  onClick,
}) => {
  const tw = containerClassMap[className] ?? className;

  if (onClick) {
    return (
      <Pressable className={tw} style={style as object} onPress={onClick}>
        {children}
      </Pressable>
    );
  }

  return (
    <View className={tw} style={style as object}>
      {children}
    </View>
  );
};
