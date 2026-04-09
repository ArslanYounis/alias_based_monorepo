import type { IconButtonProps } from "@shared/types";
import React from "react";
import { Pressable, View } from "react-native";

export type { IconButtonProps };

export const IconButton = ({ icon }: IconButtonProps) => {
  return (
    <Pressable hitSlop={8}>
      <View className="flex items-center justify-center">
        <View className="text-text-default">{icon}</View>
      </View>
    </Pressable>
  );
};
