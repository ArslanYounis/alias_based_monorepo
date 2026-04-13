import type { AvatarProps, StatusType } from "@shared/types";
import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Text } from "~/src/ui/Text";
import { ProfileIconStatus } from "../ProfileIconStatus";

export type { AvatarProps, StatusType };

export const Avatar: React.FC<AvatarProps> = ({
  imageUrl,
  initials,
  status,
  avatarSize = 32,
  badgeSize = 13.5,
  initialsFontSize = 12,
  initialsTextColor = "#12121B",
  initialsBorderColor = "#A0A0A4",
}) => {
  const isImage = !!imageUrl && imageUrl.trim() !== "";
  const hasInitials = !!initials && initials.trim() !== "";
  const showBorder = !isImage && hasInitials;

  return (
    <View className="relative inline-flex">
      <View
        style={[
          styles.avatar,
          {
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2,
            borderWidth: showBorder ? 1 : 0,
            borderColor: initialsBorderColor,
          },
        ]}
      >
        {isImage ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : hasInitials ? (
          <Text
            style={{
              fontSize: initialsFontSize,
              color: initialsTextColor,
              fontWeight: "500",
            }}
          >
            {initials.slice(0, 2).toUpperCase()}
          </Text>
        ) : (
          <Image
            source={{
              uri: "https://adrec-images.mastermind-mindset.com/DefaultImg.png",
            }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
      </View>

      {status && (
        <View
          style={[
            styles.statusWrapper,
            {
              width: badgeSize,
              height: badgeSize,
              borderRadius: badgeSize / 2,
              bottom: -2,
              right: -3,
            },
          ]}
        >
          <ProfileIconStatus
            status={status}
            width={badgeSize}
            height={badgeSize}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    overflow: "hidden",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  statusWrapper: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    top: 20,
  },
});
