import type { IconButtonProps } from "@shared/types";
import React from "react";
import { Pressable, View } from "react-native";

export type { IconButtonProps };

export const IconButton = ({ icon }: IconButtonProps) => {
  return (
    <Pressable className="flex items-center justify-center" hitSlop={8}>
      <View className="text-text-default">{icon}</View>
    </Pressable>
  );
};
