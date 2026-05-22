import React from "react";
import { Avatar } from "../Avatar";
import { Pressable } from "react-native";
import { IconButton } from "../IconButton";
import { Container } from "@platform/Container";
import type { HeaderProps } from "@shared/types";
import StatusUp from "~/assets/svg/icons/StatusUp";
import Settings from "~/assets/svg/icons/Settings";

export type { HeaderProps };
export type { HeaderMenuItem } from "@shared/types";

export const Header: React.FC<HeaderProps> = ({
  avatarUrl,
  isEditing = false,
  onAvatarPress,
}) => {
  return (
    <Container
      className={`bg-Base-White flex flex-row items-center justify-between pt-4 pb-3 px-m ${
        isEditing ? "opacity-50" : ""
      }`}
    >
      {/* Left Section */}
      <Container className="flex flex-row items-center gap-s">
        {/* Avatar */}
        <Pressable
          onPress={onAvatarPress}
          className="flex-row items-center gap-xs"
        >
          <Avatar imageUrl={avatarUrl} status="complete" />
        </Pressable>
      </Container>
      {/* Right Section */}
      <Container className="flex flex-row items-center gap-s">
        <IconButton icon={<Settings className="text-text-default" />} />
        <IconButton icon={<StatusUp className="text-text-default" />} />
      </Container>
    </Container>
  );
};
