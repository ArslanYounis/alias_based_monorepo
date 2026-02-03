import React from "react";
import { Pressable, View } from "react-native";

export const IconButton = ({ icon }: { icon: React.ReactNode }) => {
  return (
    <Pressable className="flex items-center justify-center" hitSlop={8}>
      <View className="text-text-default">{icon}</View>
    </Pressable>
  );
};
