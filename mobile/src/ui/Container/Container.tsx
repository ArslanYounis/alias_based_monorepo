import React from "react";
import { View, Pressable, StyleSheet, ViewStyle } from "react-native";
import type { ContainerProps } from "@shared/types";

export const Container: React.FC<ContainerProps> = ({
  children,
  style,
  className,
  dir,
  onClick,
}) => {
  const containerStyle: ViewStyle = {
    ...styles.container,
    ...(style as ViewStyle),
    ...(dir === "rtl" && { writingDirection: "rtl" as const }),
  };

  if (onClick) {
    return (
      <Pressable className={className} style={containerStyle} onPress={onClick}>
        {children}
      </Pressable>
    );
  }

  return (
    <View className={className} style={containerStyle}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
  },
});
