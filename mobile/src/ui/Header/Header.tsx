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
      className={`bg-base-white flex flex-row items-center justify-between pt-4 pb-3 ${
        isEditing ? "opacity-50" : ""
      }`}
    >
      {/* Left Section */}
      <Container className="flex flex-row items-center gap-3">
        {/* Avatar */}
        <Pressable
          onPress={onAvatarPress}
          className="flex-row items-center gap-2"
        >
          <Avatar imageUrl={avatarUrl} status="complete" />
        </Pressable>
      </Container>
      {/* Right Section */}
      <Container className="flex flex-row items-center gap-3">
        <IconButton icon={<Settings className="text-text-default" />} />
        <IconButton icon={<StatusUp className="text-text-default" />} />
      </Container>
    </Container>
  );
};
