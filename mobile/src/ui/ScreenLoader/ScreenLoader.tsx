import React from "react";
import type { ScreenLoaderProps } from "@shared/types";
import { Modal, View, ActivityIndicator, Image } from "react-native";

export type { ScreenLoaderProps };

const ScreenLoader: React.FC<ScreenLoaderProps> = ({
  isLoading = false,
  gifSrc = "https://adrec-images.mastermind-mindset.com/TrailLoading.gif",
  alt = "Loading...",
}) => {
  if (!isLoading) return null;
  return (
    <Modal visible={isLoading} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(204, 204, 204, 0.4)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {gifSrc ? (
          <Image
            source={{ uri: gifSrc }}
            style={{ width: 80, height: 80 }}
            resizeMode="contain"
            accessibilityLabel={alt}
          />
        ) : (
          <ActivityIndicator size="large" />
        )}
      </View>
    </Modal>
  );
};

export default ScreenLoader;
